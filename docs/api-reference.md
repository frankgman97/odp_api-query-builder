# USPTO Open Data Portal - API Reference

## Endpoint

**GET/POST** `https://api.uspto.gov/api/v1/patent/applications/search`

- API Key required
- Data refreshed daily
- If no field specified, searches across all application data
- If no response attributes specified, returns all data attributes

---

## Query Syntax

### Fielded Search
Specify `field.path:value` — e.g., `applicationMetaData.patentNumber:D1011682`

### Date Ranges
Inclusive: `applicationMetaData.filingDate:[2002-01-01 TO 2003-01-01]`
Exclusive: use parentheses `(` `)` instead of brackets

### Booleans
`AND`, `OR`, `NOT` (must be ALL CAPS)
- `&&` = AND, `||` = OR, `–` = NOT
- Parentheses for grouping: `((Nikon OR Trimble) AND LTD)`

### Wildcards
- `?` — single character: `te?t`
- `*` — multiple characters: `te*t`

### Fuzzy Search
Tilde `~` at end of term: `Patent~`

---

## Searchable Fields

### Top-Level Fields

| Field Path | Description | Type |
|---|---|---|
| `applicationNumberText` | Unique number assigned by USPTO to a patent application | String |
| `lastIngestionDateTime` | Date/time when application was last modified | Date |

### applicationMetaData (Application Metadata)

| Field Path | Description | Type |
|---|---|---|
| `applicationMetaData.firstInventorToFileIndicator` | AIA first-inventor-to-file indicator | String |
| `applicationMetaData.nationalStageIndicator` | National Stage indicator | Boolean |
| `applicationMetaData.docketNumber` | Identifier assigned by applicant for internal tracking | String |
| `applicationMetaData.firstApplicantName` | Name of Rank One applicant | String |
| `applicationMetaData.firstInventorName` | Name of Rank One inventor | String |
| `applicationMetaData.applicationConfirmationNumber` | 4-digit verification number | Number |
| `applicationMetaData.applicationStatusDate` | Application status date | Date |
| `applicationMetaData.applicationStatusDescriptionText` | Status text (e.g., "Patented Case", "Abandoned") | String |
| `applicationMetaData.applicationStatusCode` | Status code number | String |
| `applicationMetaData.filingDate` | Date application was filed at USPTO | Date |
| `applicationMetaData.effectiveFilingDate` | Effective filing date per USPTO criteria | Date |
| `applicationMetaData.grantDate` | Date patent was granted | Date |
| `applicationMetaData.groupArtUnitNumber` | 4-digit art unit number (e.g., "1642") | String |
| `applicationMetaData.applicationTypeCode` | Type code: UTL, DES, PLT, etc. | String |
| `applicationMetaData.applicationTypeLabelName` | Label: Utility, Design, Plant, etc. | String |
| `applicationMetaData.applicationTypeCategory` | Category of application (e.g., REGULAR) | String |
| `applicationMetaData.inventionTitle` | Title of the invention | String |
| `applicationMetaData.patentNumber` | Unique number for granted patent | String |
| `applicationMetaData.businessEntityStatusCategory` | Entity size status for fee purposes | String |
| `applicationMetaData.earliestPublicationNumber` | Earliest publication number | String |
| `applicationMetaData.earliestPublicationDate` | Earliest publication date | Date |
| `applicationMetaData.pctPublicationNumber` | PCT/WIPO publication number | String |
| `applicationMetaData.pctPublicationDate` | PCT publication date | String |
| `applicationMetaData.examinerNameText` | Name of assigned examiner | String |
| `applicationMetaData.customerNumber` | Unique USPTO customer number | Number |

### applicationMetaData.entityStatusData

| Field Path | Description | Type |
|---|---|---|
| `applicationMetaData.entityStatusData.smallEntityStatusIndicator` | Small entity status | Boolean |
| `applicationMetaData.entityStatusData.businessEntityStatusCategory` | Entity category for fees | String |

### cpcClassificationBag (CPC Classifications)

| Field Path | Description | Type |
|---|---|---|
| `applicationMetaData.cpcClassificationBag` | All CPC codes associated with application | Array |

### publicationSequenceNumberBag

| Field Path | Description | Type |
|---|---|---|
| `applicationMetaData.publicationSequenceNumberBag` | Publication sequence numbers (year + 7 digits + kind code) | Array |

### correspondenceAddressBag (Top-Level Correspondence)

| Field Path | Description | Type |
|---|---|---|
| `correspondenceAddressBag.nameLineOneText` | First line of name | String |
| `correspondenceAddressBag.nameLineTwoText` | Second line of name | String |
| `correspondenceAddressBag.addressLineOneText` | First line of address | String |
| `correspondenceAddressBag.addressLineTwoText` | Second line of address | String |
| `correspondenceAddressBag.geographicRegionName` | State/region name | String |
| `correspondenceAddressBag.geographicRegionCode` | State/region code | String |
| `correspondenceAddressBag.postalCode` | Postal code | String |
| `correspondenceAddressBag.cityName` | City | String |
| `correspondenceAddressBag.countryCode` | Country code | String |
| `correspondenceAddressBag.countryName` | Country name | String |
| `correspondenceAddressBag.postalAddressCategory` | Address category | String |

### applicantBag (Applicants)

| Field Path | Description | Type |
|---|---|---|
| `applicationMetaData.applicantBag.applicantNameText` | Applicant name | String |
| `applicationMetaData.applicantBag.firstName` | First name | String |
| `applicationMetaData.applicantBag.middleName` | Middle name | String |
| `applicationMetaData.applicantBag.lastName` | Last name | String |
| `applicationMetaData.applicantBag.preferredName` | Preferred name | String |
| `applicationMetaData.applicantBag.namePrefix` | Name prefix | String |
| `applicationMetaData.applicantBag.nameSuffix` | Name suffix | String |
| `applicationMetaData.applicantBag.countryCode` | Country code | String |

### inventorBag (Inventors)

| Field Path | Description | Type |
|---|---|---|
| `applicationMetaData.inventorBag.firstName` | First name | String |
| `applicationMetaData.inventorBag.middleName` | Middle name | String |
| `applicationMetaData.inventorBag.lastName` | Last name | String |
| `applicationMetaData.inventorBag.preferredName` | Preferred name | String |
| `applicationMetaData.inventorBag.namePrefix` | Name prefix | String |
| `applicationMetaData.inventorBag.nameSuffix` | Name suffix | String |
| `applicationMetaData.inventorBag.countryCode` | Country code | String |
| `applicationMetaData.inventorBag.inventorNameText` | Full inventor name | String |

### assignmentBag (Assignments/Ownership)

| Field Path | Description | Type |
|---|---|---|
| `assignmentBag.reelNumber` | Reel number (1-6 digits) | Number |
| `assignmentBag.frameNumber` | Frame number (1-4 digits) | Number |
| `assignmentBag.reelAndFrameNumber` | Combined reel/frame | String |
| `assignmentBag.pageTotalQuantity` | Total pages in document | Number |
| `assignmentBag.assignmentDocumentLocationURI` | Document location URI | String |
| `assignmentBag.assignmentReceivedDate` | Date assignment received | Date |
| `assignmentBag.assignmentRecordedDate` | Date assignment recorded at USPTO | Date |
| `assignmentBag.imageAvailableStatusCode` | Image availability | Boolean |
| `assignmentBag.assignmentMailedDate` | Date assignment mailed | Date |
| `assignmentBag.conveyanceText` | Description of interest conveyed | String |

### assignmentBag.assignorBag (Assignors)

| Field Path | Description | Type |
|---|---|---|
| `assignmentBag.assignorBag.assignorName` | Assignor name | String |
| `assignmentBag.assignorBag.executionDate` | Date assignment was executed | Date |

### assignmentBag.assigneeBag (Assignees)

| Field Path | Description | Type |
|---|---|---|
| `assignmentBag.assigneeBag.assigneeNameText` | Assignee name | String |
| `assignmentBag.assigneeBag.assigneeAddress.addressLineOneText` | Address line 1 | String |
| `assignmentBag.assigneeBag.assigneeAddress.addressLineTwoText` | Address line 2 | String |
| `assignmentBag.assigneeBag.assigneeAddress.addressLineThreeText` | Address line 3 | String |
| `assignmentBag.assigneeBag.assigneeAddress.addressLineFourText` | Address line 4 | String |
| `assignmentBag.assigneeBag.assigneeAddress.cityName` | City | String |
| `assignmentBag.assigneeBag.assigneeAddress.geographicRegionName` | Region name | String |
| `assignmentBag.assigneeBag.assigneeAddress.geographicRegionCode` | Region code | String |
| `assignmentBag.assigneeBag.assigneeAddress.countryName` | Country name | String |
| `assignmentBag.assigneeBag.assigneeAddress.postalCode` | Postal code | String |

### assignmentBag.correspondenceAddress

| Field Path | Description | Type |
|---|---|---|
| `assignmentBag.correspondenceAddress.correspondentNameText` | Correspondent name | String |
| `assignmentBag.correspondenceAddress.addressLineOneText` | Address line 1 | String |
| `assignmentBag.correspondenceAddress.addressLineTwoText` | Address line 2 | String |

### assignmentBag.domesticRepresentative

| Field Path | Description | Type |
|---|---|---|
| `assignmentBag.domesticRepresentative.name` | Domestic representative name | String |
| `assignmentBag.domesticRepresentative.addressLineOneText` | Address line 1 | String |
| `assignmentBag.domesticRepresentative.cityName` | City | String |
| `assignmentBag.domesticRepresentative.postalCode` | Postal code | String |
| `assignmentBag.domesticRepresentative.geographicRegionName` | Region name | String |
| `assignmentBag.domesticRepresentative.countryName` | Country | String |
| `assignmentBag.domesticRepresentative.emailAddress` | Email | String |

### recordAttorney (Attorney/Agent Data)

| Field Path | Description | Type |
|---|---|---|
| `recordAttorney.customerNumberCorrespondenceData.patronIdentifier` | Unique patron ID | String |
| `recordAttorney.customerNumberCorrespondenceData.organizationStandardName` | Organization name | String |

### recordAttorney.powerOfAttorneyBag / attorneyBag

| Field Path | Description | Type |
|---|---|---|
| `recordAttorney.powerOfAttorneyBag.firstName` | Attorney first name | String |
| `recordAttorney.powerOfAttorneyBag.middleName` | Attorney middle name | String |
| `recordAttorney.powerOfAttorneyBag.lastName` | Attorney last name | String |
| `recordAttorney.powerOfAttorneyBag.registrationNumber` | Registration number | Number |
| `recordAttorney.powerOfAttorneyBag.activeIndicator` | Active status | Boolean |
| `recordAttorney.powerOfAttorneyBag.registeredPractitionerCategory` | Category (ATTNY/AGENT) | String |

### foreignPriorityBag (Foreign Priority)

| Field Path | Description | Type |
|---|---|---|
| `foreignPriorityBag.ipOfficeName` | IP office name (country) | String |
| `foreignPriorityBag.filingDate` | Priority filing date | Date |
| `foreignPriorityBag.applicationNumberText` | Foreign application number | String |

### parentContinuityBag (Parent Continuity)

| Field Path | Description | Type |
|---|---|---|
| `parentContinuityBag.firstInventorToFileIndicator` | AIA indicator | Boolean |
| `parentContinuityBag.parentApplicationStatusCode` | Parent app status code | Number |
| `parentContinuityBag.parentPatentNumber` | Parent patent number | String |
| `parentContinuityBag.parentApplicationStatusDescriptionText` | Parent status text | String |
| `parentContinuityBag.parentApplicationFilingDate` | Parent filing date | Date |
| `parentContinuityBag.parentApplicationNumberText` | Parent application number | String |
| `parentContinuityBag.childApplicationNumberText` | Child application number | String |
| `parentContinuityBag.claimParentageTypeCode` | Parentage code (CON, CIP, DIV) | String |
| `parentContinuityBag.claimParentageTypeCodeDescriptionText` | Parentage description | String |

### childContinuityBag (Child Continuity)

| Field Path | Description | Type |
|---|---|---|
| `childContinuityBag.childApplicationStatusCode` | Child app status code | String |
| `childContinuityBag.parentApplicationNumberText` | Parent application number | String |
| `childContinuityBag.childApplicationNumberText` | Child application number | String |
| `childContinuityBag.childApplicationStatusDescriptionText` | Child status text | String |
| `childContinuityBag.childApplicationFilingDate` | Child filing date | Date |
| `childContinuityBag.firstInventorToFileIndicator` | AIA indicator | Boolean |
| `childContinuityBag.childPatentNumber` | Child patent number | String |
| `childContinuityBag.claimParentageTypeCode` | Parentage code | String |
| `childContinuityBag.claimParentageTypeCodeDescriptionText` | Parentage description | String |

### patentTermAdjustmentData (PTA)

| Field Path | Description | Type |
|---|---|---|
| `patentTermAdjustmentData.aDelayQuantity` | A delays (pre-allowance USPTO delays) | Number |
| `patentTermAdjustmentData.bDelayQuantity` | B delays (3-year pendency) | Number |
| `patentTermAdjustmentData.cDelayQuantity` | C delays (interference/secrecy/appeal) | Number |
| `patentTermAdjustmentData.overlappingDayQuantity` | Overlapping delay days | Number |
| `patentTermAdjustmentData.nonOverlappingDayQuantity` | Non-overlapping delay days | Number |
| `patentTermAdjustmentData.applicantDayDelayQuantity` | Applicant delay days | Number |
| `patentTermAdjustmentData.adjustmentTotalQuantity` | Total PTA days | Number |

### patentTermAdjustmentData.patentTermAdjustmentHistoryDataBag

| Field Path | Description | Type |
|---|---|---|
| `patentTermAdjustmentData.patentTermAdjustmentHistoryDataBag.eventDate` | Event date | Date |
| `patentTermAdjustmentData.patentTermAdjustmentHistoryDataBag.eventDescriptionText` | Event description | String |
| `patentTermAdjustmentData.patentTermAdjustmentHistoryDataBag.eventSequenceNumber` | Sequence number | Number |
| `patentTermAdjustmentData.patentTermAdjustmentHistoryDataBag.originatingEventSequenceNumber` | Start sequence number | Number |
| `patentTermAdjustmentData.patentTermAdjustmentHistoryDataBag.ptaPTECode` | PTA or PTE code | String |
| `patentTermAdjustmentData.patentTermAdjustmentHistoryDataBag.ipOfficeDayDelayQuantity` | USPTO manual adjustment days | Number |
| `patentTermAdjustmentData.patentTermAdjustmentHistoryDataBag.applicantDayDelayQuantity` | Applicant delay days | Number |

### eventDataBag (Prosecution History Events)

| Field Path | Description | Type |
|---|---|---|
| `eventDataBag.eventCode` | Transaction code | String |
| `eventDataBag.eventDescriptionText` | Transaction description | String |
| `eventDataBag.eventDate` | Date recorded | Date |

### pgpubDocumentMetaData (Pre-Grant Publication)

| Field Path | Description | Type |
|---|---|---|
| `pgpubDocumentMetaData.zipFileName` | Zip file name | String |
| `pgpubDocumentMetaData.productIdentifier` | Product identifier | String |
| `pgpubDocumentMetaData.fileLocationURI` | File location URI | String |
| `pgpubDocumentMetaData.fileCreateDateTime` | File creation date | Date |
| `pgpubDocumentMetaData.xmlFileName` | XML file name | String |

### grantDocumentMetaData (Grant Document)

| Field Path | Description | Type |
|---|---|---|
| `grantDocumentMetaData.zipFileName` | Zip file name | String |
| `grantDocumentMetaData.productIdentifier` | Product identifier | String |
| `grantDocumentMetaData.fileLocationURI` | File location URI | String |
| `grantDocumentMetaData.fileCreateDateTime` | File creation date | Date |
| `grantDocumentMetaData.xmlFileName` | XML file name | String |
