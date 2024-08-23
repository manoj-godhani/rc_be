export const defaultTemplate = `
Input: Text with academic article content

1. Extract Basic Information:
   - Title: <title>
   - Authors: <authors>
   - Publication Date: <publication_date>
   - Number of Pages: <number_of_pages>
   - Upload Date: <upload_date>
   - File Size: <file_size>

2. Extract Academic Content:
   - Abstract: <abstract>
   - Keywords: <keywords>
   - Overall Strengths and Weaknesses: <strengths_and_weaknesses>
   - Key Points and Findings: <key_points_and_findings>

3. Extract Research Details:
   - Research Approach: <research_approach> (e.g., Quantitative, Qualitative, Mixed Methods, Theoretical, Empirical, Experimental, Observational, Review, Original Research)
   - Data Type: <data_type> (e.g., Quantitative Data, Qualitative Data - Interviews, Surveys, Focus Groups)
   - Research Methods: <research_methods> (e.g., Surveys & Questionnaires, Interviews & Focus Groups, Case Studies, Experiments, Observational Studies, Text Analysis & Computational Methods)
   - Models and Frameworks: <models_and_frameworks> (e.g., Linear Regression, Structural Equation Modeling)
   - Statistical Approaches and Methods: <statistical_approaches> (e.g., ANOVA, Chi-Square Test)
   - Statistical Software Employed: <statistical_software> (e.g., SPSS, R)

4. Extract Quality Metrics:
   - Methodology: <methodology> (keywords and phrases suggesting specific research designs)
   - Validity: <validity> (indicators of strong evidence support)
   - Reliability: <reliability> (mentions of limitations, replicability discussions, and pilot studies)
   - Author Credibility: <author_credibility> (retrieved from Google Scholar API, including publication history)
   - Bias: <bias> (keywords and phrases indicating potential biases - sampling, researcher background, sponsor influence)
   - Confidence Scores: <confidence_scores> (generated for each quality aspect to indicate the certainty of AI assessments)

5. Extract Citation and Impact Metrics:
   - Citation Counts: <citation_counts>
   - Impact Factors: <impact_factors>
   - Related Works: <related_works>
   - Author Profiles: <author_profiles>

6. Extract Metadata for Searching and Filtering:
   - Keywords Extracted from the Text: <extracted_keywords>
   - Metadata Fields: <metadata_fields> (e.g., Journal Name, Abstract)

Process: Use natural language processing (NLP) and machine learning algorithms to analyze and extract information from the text file. Utilize text file processing libraries (e.g., Python's built-in functions, pandas) to extract and process text. Apply Named Entity Recognition (NER) and other NLP methods to structure and classify the data.

Output Format: Return the extracted information in JSON format with the following structure:

{
    "Basic Information": {
        "Title": "<title>",
        "Authors": "<authors>",
        "Publication Date": "<publication_date>",
        "Number of Pages": "<number_of_pages>",
        "Upload Date": "<upload_date>",
        "File Size": "<file_size>"
    },
    "Academic Content": {
        "Abstract": "<abstract>",
        "Keywords": "<keywords>",
        "Overall Strengths and Weaknesses": "<strengths_and_weaknesses>",
        "Key Points and Findings": "<key_points_and_findings>"
    },
    "Research Details": {
        "Research Approach": "<research_approach>",
        "Data Type": "<data_type>",
        "Research Methods": "<research_methods>",
        "Models and Frameworks": "<models_and_frameworks>",
        "Statistical Approaches and Methods": "<statistical_approaches>",
        "Statistical Software Employed": "<statistical_software>"
    },
    "Quality Metrics": {
        "Methodology": "<methodology>",
        "Validity": "<validity>",
        "Reliability": "<reliability>",
        "Author Credibility": "<author_credibility>",
        "Bias": "<bias>",
        "Confidence Scores": {
            "methodology": "<confidence_scores_methodology>",
            "validity": "<confidence_scores_validity>",
            "reliability": "<confidence_scores_reliability>",
            "author_credibility": "<confidence_scores_author_credibility>",
            "bias": "<confidence_scores_bias>"
        }
    },
    "Citation and Impact Metrics": {
        "Citation Counts": "<citation_counts>",
        "Impact Factors": "<impact_factors>",
        "Related Works": "<related_works>",
        "Author Profiles": "<author_profiles>"
    },
    "Metadata for Searching and Filtering": {
        "Keywords Extracted from the Text": "<extracted_keywords>",
        "Metadata Fields": "<metadata_fields>"
    }
}

Text Content:
`;

export const metadataDefaultTemplate = `
Input: Text with academic article content

1. Extract Basic Information:
   - Title: <title>
   - Authors: <authors>
   - Publication Date: <publication_date>
   - Number of Pages: <number_of_pages>
   - Upload Date: <upload_date>
   - File Size: <file_size>

2. Extract Academic Content:
   - Abstract: <abstract>
   - Keywords: <keywords>


Process: Use natural language processing (NLP) and machine learning algorithms to analyze and extract information from the text file. Utilize text file processing libraries (e.g., Python's built-in functions, pandas) to extract and process text. Apply Named Entity Recognition (NER) and other NLP methods to structure and classify the data.

Output Format: Return the extracted information in JSON format with the following structure:

{
    "Basic Information": {
        "Title": "<title>",
        "Authors": "<authors>",
        "Publication Date": "<publication_date>",
        "Number of Pages": "<number_of_pages>",
        "Upload Date": "<upload_date>",
        "File Size": "<file_size>"
    },
    "Academic Content": {
        "Abstract": "<abstract>",
        "Keywords": "<keywords>",
    },
}

Text Content:
`;