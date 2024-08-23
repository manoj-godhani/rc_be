import stripePackage from 'stripe';
import { config } from '../config';

const stripeSecretKey = config.stripeSecretKey as string;
const stripe: any = new stripePackage(stripeSecretKey);

export const createStripeCustomer = async (email) => {
   
    const customer = await stripe.customers.create({   
        email 
    });

    
    return customer.id
}

export const getStripeOrderDetails = async (sessionId:string) => {
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

    const subscription = await stripe.subscriptions.retrieve(checkoutSession?.subscription)
    return subscription
}
export const checkoutSession = async (lookupKey:any, { customer }:any) => {

    const prices = await stripe.prices.list({
        lookup_keys: [lookupKey],
        expand: ['data.product'],
    });

    const session = await stripe.checkout.sessions.create({
        billing_address_collection: 'auto',
        customer,
        line_items: [
            {
                price: prices.data[0]?.id,
                quantity: 1,
            },
        ],
        mode: 'subscription',
        success_url:` ${config.frontEndUrl}subscription-plan/?success=true&session_id={CHECKOUT_SESSION_ID}`.trim(),
        cancel_url: `${config.frontEndUrl}subscription-plan/?canceled=true`.trim(),
    });
    return session.url
}


export const portalSession = async (customer) => {
   
    const portalSession = await stripe.billingPortal.sessions.create({
        customer: customer,
        return_url: config.frontEndUrl, 
    });

    return portalSession?.url
}

export const stirpeCustomerUpdate = async (customerId:any, { city, country, line1, line2, state, postal_code }) => {
    const customer =  await stripe.customers.update(
        customerId,
        {
            address: {
                city,
                country,
                line1,
                line2,
                state,
                postal_code
            },
        }
    );

    return customer;
};