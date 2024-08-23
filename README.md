# researchcollab-backend

This backend repository is currently under development.

## Setup Instructions

### Prerequisites

1. **Node.js**: Install Node.js version 20 or higher.

### Step-by-Step Setup

1. **Clone the Repository**

   ```bash
   git clone <repository-url>
   cd researchcollab-backend

    ```
   
2. **Install Dependencies**

    ```bash
    npm install
    ```
   
3. Create Environment Variables

    Create a `.env` file in the root directory of the project and add the following environment variables:

    ```bash
    SUPABASE_URL=<your-supabase-url>
    SUPABASE_KEY=<your-supabase-key>
    GEMINI_API_KEY_SECRET=<your-gemini-api-key-secret>
    ```
   
4. **Generate supabase types if needed**

    ```bash
   npx supabase gen types typescript --project-id "nieenykvkjphblhvunmk" --schema public > types/supabase.ts
    ```
   
5. **Modify pdf-parser**

    MComment out all code from lines 10 to 26 in the pdf-parser module located in node_modules.

6. **Run the Project**

    ```bash
   npm run dev
    ```

## Notes
Project Structure, Code Style Guide, and Branching Strategy: These will be described later.