# Compliance Classifier Test Documents

This directory contains sample compliance documents for testing and demonstrating the capabilities of the Compliance Classifier system. These documents represent various compliance categories and risk levels to help users understand how the system classifies different types of compliance content.

## Document Overview

The sample documents in this directory include:

1. **data_privacy_policy.txt** - A data privacy policy document
   - **Compliance Category:** Data Privacy
   - **Risk Level:** High
   - **Format:** TXT (can be converted to PDF/DOCX for testing)
   - **Description:** A comprehensive data privacy policy that outlines how a company collects, uses, and protects personal data in accordance with regulations like GDPR and CCPA.

2. **quarterly_financial_report.txt** - A quarterly financial report
   - **Compliance Category:** Financial Reporting
   - **Risk Level:** Medium
   - **Format:** TXT (can be converted to PDF/DOCX for testing)
   - **Description:** A quarterly financial report that complies with financial reporting standards and SOX requirements.

3. **code_of_conduct.txt** - A corporate code of conduct
   - **Compliance Category:** Workplace Conduct
   - **Risk Level:** Medium
   - **Format:** TXT (can be converted to PDF/DOCX for testing)
   - **Description:** A comprehensive code of conduct that outlines expected behavior, ethical standards, and compliance requirements for employees.

4. **healthcare_compliance_report.txt** - A healthcare compliance report
   - **Compliance Category:** Health Compliance
   - **Risk Level:** High
   - **Format:** TXT (can be converted to PDF/DOCX for testing)
   - **Description:** An annual compliance report for a healthcare division, covering HIPAA compliance, clinical compliance, and other healthcare regulations.

5. **corporate_compliance_framework.txt** - An integrated compliance framework
   - **Compliance Category:** Multiple (Data Privacy, Financial Reporting, Workplace Conduct)
   - **Risk Level:** High
   - **Format:** TXT (can be converted to PDF/DOCX for testing)
   - **Description:** A comprehensive corporate compliance framework that addresses multiple compliance domains.

## Using the Test Documents

These sample documents can be used for various testing and demonstration purposes:

### Testing Document Upload and Processing

1. Use these documents to test the document upload functionality:
   ```
   POST /api/document/batch/{batchId}/upload
   ```

2. Verify that the system correctly extracts text content from different file formats.

### Testing Classification Capabilities

1. Upload the documents to test the classification functionality.
2. Verify that the system correctly identifies:
   - Compliance categories (Data Privacy, Financial Reporting, Workplace Conduct, Health Compliance)
   - Risk levels (Low, Medium, High)
   - Key compliance terms and concepts

### Demonstrating System Features

1. Use these documents in demonstrations to showcase:
   - Batch processing capabilities
   - Classification accuracy
   - Metadata extraction
   - Search functionality
   - Reporting features

### Training and Onboarding

1. Use these documents to train new users on how to:
   - Upload and process documents
   - Interpret classification results
   - Manage document batches
   - Generate compliance reports

## Document Conversion

These documents are provided in TXT format for easy editing and viewing. For more realistic testing, you may want to convert them to PDF or DOCX formats:

### Converting to PDF

1. Open the TXT file in a word processor (Microsoft Word, Google Docs, etc.)
2. Format the document as desired
3. Save or export as PDF

### Converting to DOCX

1. Open the TXT file in Microsoft Word
2. Format the document as desired
3. Save as DOCX format

## Metadata

Each document includes embedded metadata that the system should extract during processing:

- Author information
- Creation date
- Last modified date
- Keywords
- Document classification
- Compliance category
- Risk level

## Extending the Test Suite

To create additional test documents:

1. Use these samples as templates
2. Modify the content to represent different compliance scenarios
3. Ensure each document includes appropriate metadata
4. Save in the desired format (TXT, PDF, DOCX)

## Notes

- These documents are fictional and created for testing purposes only
- The content is designed to trigger specific classification patterns in the system
- Documents contain realistic metadata to test metadata extraction capabilities