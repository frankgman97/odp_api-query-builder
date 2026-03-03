import type { FieldDefinition } from './types';

export const FIELD_SCHEMA: FieldDefinition[] = [
  // ═══════════════════════════════════════════
  // TOP-LEVEL
  // ═══════════════════════════════════════════
  {
    path: 'applicationNumberText',
    label: 'Application Number',
    type: 'string',
    section: 'Application Info',
    description: 'Unique number assigned by USPTO to a patent application when filed',
    example: '18/620,192',
  },
  {
    path: 'lastIngestionDateTime',
    label: 'Last Ingestion Date',
    type: 'date',
    section: 'Application Info',
    description: 'Date/time when application data was last modified',
  },

  // ═══════════════════════════════════════════
  // APPLICATION METADATA
  // ═══════════════════════════════════════════
  {
    path: 'applicationMetaData.inventionTitle',
    label: 'Invention Title',
    type: 'string',
    section: 'Application Info',
    description: 'Title of the invention as provided by the patent applicant',
    example: 'Autonomous Robot*',
  },
  {
    path: 'applicationMetaData.filingDate',
    label: 'Filing Date',
    type: 'date',
    section: 'Application Info',
    description: 'Date application was filed and received in the USPTO',
    example: '2023-01-15',
  },
  {
    path: 'applicationMetaData.effectiveFilingDate',
    label: 'Effective Filing Date',
    type: 'date',
    section: 'Application Info',
    description: 'Date the patent case qualified as having been filed per USPTO criteria',
  },
  {
    path: 'applicationMetaData.grantDate',
    label: 'Grant Date',
    type: 'date',
    section: 'Application Info',
    description: 'Date the patent was granted',
  },
  {
    path: 'applicationMetaData.patentNumber',
    label: 'Patent Number',
    type: 'string',
    section: 'Application Info',
    description: 'Unique number assigned to a granted/issued patent',
    example: 'D1,011,682',
  },
  {
    path: 'applicationMetaData.applicationTypeCode',
    label: 'Application Type Code',
    type: 'string',
    section: 'Application Info',
    description: 'Code indicating if the application is domestic or PCT',
    enumValues: ['UTL', 'DES', 'PLT', 'PRV', 'REI'],
  },
  {
    path: 'applicationMetaData.applicationTypeLabelName',
    label: 'Application Type Label',
    type: 'string',
    section: 'Application Info',
    description: 'Label for the application type',
    enumValues: ['Utility', 'Design', 'Plant', 'Provisional', 'Reissue'],
  },
  {
    path: 'applicationMetaData.applicationTypeCategory',
    label: 'Application Type Category',
    type: 'string',
    section: 'Application Info',
    description: 'Category of the application',
    example: 'REGULAR',
  },
  {
    path: 'applicationMetaData.applicationStatusCode',
    label: 'Application Status Code',
    type: 'string',
    section: 'Application Info',
    description: 'Numeric code classifying the application by its status',
    example: '150',
  },
  {
    path: 'applicationMetaData.applicationStatusDescriptionText',
    label: 'Application Status',
    type: 'string',
    section: 'Application Info',
    description: 'Status text (e.g., Patented Case, Abandoned, Docketed New Case)',
    example: 'Patented Case',
  },
  {
    path: 'applicationMetaData.applicationStatusDate',
    label: 'Application Status Date',
    type: 'date',
    section: 'Application Info',
    description: 'Date of the current application status',
  },
  {
    path: 'applicationMetaData.applicationConfirmationNumber',
    label: 'Confirmation Number',
    type: 'number',
    section: 'Application Info',
    description: 'Four-digit verification number assigned to each newly filed patent application',
    example: '2251',
  },
  {
    path: 'applicationMetaData.firstInventorToFileIndicator',
    label: 'First Inventor to File (AIA)',
    type: 'string',
    section: 'Application Info',
    description: 'AIA first-inventor-to-file indicator (Y/N)',
    enumValues: ['Y', 'N'],
  },
  {
    path: 'applicationMetaData.nationalStageIndicator',
    label: 'National Stage Indicator',
    type: 'boolean',
    section: 'Application Info',
    description: 'Whether this is a national stage application',
  },
  {
    path: 'applicationMetaData.groupArtUnitNumber',
    label: 'Group Art Unit',
    type: 'string',
    section: 'Application Info',
    description: 'Four-digit art unit number responsible for the patent art cluster',
    example: '1637',
  },
  {
    path: 'applicationMetaData.examinerNameText',
    label: 'Examiner Name',
    type: 'string',
    section: 'Application Info',
    description: 'Name of the assigned patent examiner',
    example: 'RILEY, JEZIA',
  },
  {
    path: 'applicationMetaData.customerNumber',
    label: 'Customer Number',
    type: 'number',
    section: 'Application Info',
    description: 'Unique number created by USPTO used in lieu of physical address',
    example: '57770',
  },
  {
    path: 'applicationMetaData.docketNumber',
    label: 'Docket Number',
    type: 'string',
    section: 'Application Info',
    description: 'Identifier assigned by the applicant for internal tracking',
    example: '1407-00-014U03',
  },
  {
    path: 'applicationMetaData.firstApplicantName',
    label: 'First Applicant Name',
    type: 'string',
    section: 'Application Info',
    description: 'Name of the Rank One applicant',
    example: 'Pacific Biosciences of California, Inc.',
  },
  {
    path: 'applicationMetaData.firstInventorName',
    label: 'First Inventor Name',
    type: 'string',
    section: 'Application Info',
    description: 'Name of the Rank One inventor',
    example: 'Lubomir SEBO',
  },
  {
    path: 'applicationMetaData.uspcSymbolText',
    label: 'USPC Symbol',
    type: 'string',
    section: 'Application Info',
    description: 'US Patent Classification symbol',
    example: '530/358',
  },
  {
    path: 'applicationMetaData.class',
    label: 'USPC Class',
    type: 'string',
    section: 'Application Info',
    description: 'US Patent Classification class number',
    example: '530',
  },
  {
    path: 'applicationMetaData.subclass',
    label: 'USPC Subclass',
    type: 'string',
    section: 'Application Info',
    description: 'US Patent Classification subclass number',
    example: '358',
  },

  // ═══════════════════════════════════════════
  // ENTITY STATUS
  // ═══════════════════════════════════════════
  {
    path: 'applicationMetaData.entityStatusData.smallEntityStatusIndicator',
    label: 'Small Entity Status',
    type: 'boolean',
    section: 'Entity Status',
    description: 'Whether the application has small entity status',
  },
  {
    path: 'applicationMetaData.entityStatusData.businessEntityStatusCategory',
    label: 'Business Entity Status',
    type: 'string',
    section: 'Entity Status',
    description: 'Large or small entity payment status for fee purposes',
    example: 'Regular Undiscounted',
  },

  // ═══════════════════════════════════════════
  // CPC CLASSIFICATIONS
  // ═══════════════════════════════════════════
  {
    path: 'applicationMetaData.cpcClassificationBag',
    label: 'CPC Classification',
    type: 'string',
    section: 'CPC Classifications',
    description: 'Cooperative Patent Classification codes associated with the application',
    example: 'C07H19/207',
  },

  // ═══════════════════════════════════════════
  // PUBLICATIONS
  // ═══════════════════════════════════════════
  {
    path: 'applicationMetaData.earliestPublicationNumber',
    label: 'Earliest Publication Number',
    type: 'string',
    section: 'Publications',
    description: 'Earliest publication number for the application',
    example: 'US20230366018A1',
  },
  {
    path: 'applicationMetaData.earliestPublicationDate',
    label: 'Earliest Publication Date',
    type: 'date',
    section: 'Publications',
    description: 'Earliest publication date',
  },
  {
    path: 'applicationMetaData.publicationSequenceNumberBag',
    label: 'Publication Sequence Number',
    type: 'string',
    section: 'Publications',
    description: 'Year + seven-digit number assigned to published applications',
    example: '0366018',
  },
  {
    path: 'applicationMetaData.pctPublicationNumber',
    label: 'PCT Publication Number',
    type: 'string',
    section: 'Publications',
    description: 'WIPO/PCT publication number',
    example: 'WO2004057439',
  },
  {
    path: 'applicationMetaData.pctPublicationDate',
    label: 'PCT Publication Date',
    type: 'string',
    section: 'Publications',
    description: 'PCT publication date',
  },
  {
    path: 'applicationMetaData.publicationCategoryBag',
    label: 'Publication Category',
    type: 'string',
    section: 'Publications',
    description: 'Publication categories (e.g., Granted/Issued, Pre-Grant Publications)',
    example: 'Granted/Issued',
  },

  // ═══════════════════════════════════════════
  // CORRESPONDENCE (TOP-LEVEL)
  // ═══════════════════════════════════════════
  {
    path: 'correspondenceAddressBag.nameLineOneText',
    label: 'Correspondence Name (Line 1)',
    type: 'string',
    section: 'Correspondence',
    description: 'First line of name associated with correspondence address',
  },
  {
    path: 'correspondenceAddressBag.nameLineTwoText',
    label: 'Correspondence Name (Line 2)',
    type: 'string',
    section: 'Correspondence',
    description: 'Second line of name associated with correspondence address',
  },
  {
    path: 'correspondenceAddressBag.addressLineOneText',
    label: 'Correspondence Address (Line 1)',
    type: 'string',
    section: 'Correspondence',
    description: 'First line of correspondence address',
  },
  {
    path: 'correspondenceAddressBag.addressLineTwoText',
    label: 'Correspondence Address (Line 2)',
    type: 'string',
    section: 'Correspondence',
    description: 'Second line of correspondence address',
  },
  {
    path: 'correspondenceAddressBag.cityName',
    label: 'Correspondence City',
    type: 'string',
    section: 'Correspondence',
    description: 'City of correspondence address',
  },
  {
    path: 'correspondenceAddressBag.geographicRegionName',
    label: 'Correspondence State/Region',
    type: 'string',
    section: 'Correspondence',
    description: 'State or region of correspondence address',
    example: 'CALIFORNIA',
  },
  {
    path: 'correspondenceAddressBag.geographicRegionCode',
    label: 'Correspondence State Code',
    type: 'string',
    section: 'Correspondence',
    description: 'State/region code of correspondence address',
    example: 'CA',
  },
  {
    path: 'correspondenceAddressBag.postalCode',
    label: 'Correspondence Postal Code',
    type: 'string',
    section: 'Correspondence',
    description: 'Postal code of correspondence address',
  },
  {
    path: 'correspondenceAddressBag.countryCode',
    label: 'Correspondence Country Code',
    type: 'string',
    section: 'Correspondence',
    description: 'Country code of correspondence address',
    example: 'US',
  },
  {
    path: 'correspondenceAddressBag.countryName',
    label: 'Correspondence Country',
    type: 'string',
    section: 'Correspondence',
    description: 'Country name of correspondence address',
  },

  // ═══════════════════════════════════════════
  // APPLICANTS
  // ═══════════════════════════════════════════
  {
    path: 'applicationMetaData.applicantBag.applicantNameText',
    label: 'Applicant Name',
    type: 'string',
    section: 'Applicants',
    description: 'Name of the applicant',
    example: 'Pacific Biosciences of California, Inc.',
  },
  {
    path: 'applicationMetaData.applicantBag.firstName',
    label: 'Applicant First Name',
    type: 'string',
    section: 'Applicants',
  },
  {
    path: 'applicationMetaData.applicantBag.middleName',
    label: 'Applicant Middle Name',
    type: 'string',
    section: 'Applicants',
  },
  {
    path: 'applicationMetaData.applicantBag.lastName',
    label: 'Applicant Last Name',
    type: 'string',
    section: 'Applicants',
  },
  {
    path: 'applicationMetaData.applicantBag.preferredName',
    label: 'Applicant Preferred Name',
    type: 'string',
    section: 'Applicants',
  },
  {
    path: 'applicationMetaData.applicantBag.namePrefix',
    label: 'Applicant Name Prefix',
    type: 'string',
    section: 'Applicants',
  },
  {
    path: 'applicationMetaData.applicantBag.nameSuffix',
    label: 'Applicant Name Suffix',
    type: 'string',
    section: 'Applicants',
  },
  {
    path: 'applicationMetaData.applicantBag.countryCode',
    label: 'Applicant Country Code',
    type: 'string',
    section: 'Applicants',
    example: 'US',
  },

  // ═══════════════════════════════════════════
  // INVENTORS
  // ═══════════════════════════════════════════
  {
    path: 'applicationMetaData.inventorBag.inventorNameText',
    label: 'Inventor Full Name',
    type: 'string',
    section: 'Inventors',
    description: 'Full name of the inventor',
    example: 'Lubomir SEBO',
  },
  {
    path: 'applicationMetaData.inventorBag.firstName',
    label: 'Inventor First Name',
    type: 'string',
    section: 'Inventors',
  },
  {
    path: 'applicationMetaData.inventorBag.middleName',
    label: 'Inventor Middle Name',
    type: 'string',
    section: 'Inventors',
  },
  {
    path: 'applicationMetaData.inventorBag.lastName',
    label: 'Inventor Last Name',
    type: 'string',
    section: 'Inventors',
    example: 'SEBO',
  },
  {
    path: 'applicationMetaData.inventorBag.preferredName',
    label: 'Inventor Preferred Name',
    type: 'string',
    section: 'Inventors',
  },
  {
    path: 'applicationMetaData.inventorBag.namePrefix',
    label: 'Inventor Name Prefix',
    type: 'string',
    section: 'Inventors',
  },
  {
    path: 'applicationMetaData.inventorBag.nameSuffix',
    label: 'Inventor Name Suffix',
    type: 'string',
    section: 'Inventors',
  },
  {
    path: 'applicationMetaData.inventorBag.countryCode',
    label: 'Inventor Country Code',
    type: 'string',
    section: 'Inventors',
    example: 'US',
  },

  // ═══════════════════════════════════════════
  // ASSIGNMENTS
  // ═══════════════════════════════════════════
  {
    path: 'assignmentBag.reelNumber',
    label: 'Assignment Reel Number',
    type: 'number',
    section: 'Assignments',
    description: '1-6 digit number identifying the reel for microfilm location',
  },
  {
    path: 'assignmentBag.frameNumber',
    label: 'Assignment Frame Number',
    type: 'number',
    section: 'Assignments',
    description: '1-4 digit number identifying the frame on microfilm',
  },
  {
    path: 'assignmentBag.reelAndFrameNumber',
    label: 'Reel and Frame Number',
    type: 'string',
    section: 'Assignments',
    description: 'Combined reel/frame number',
    example: '066070/0442',
  },
  {
    path: 'assignmentBag.pageTotalQuantity',
    label: 'Assignment Page Count',
    type: 'number',
    section: 'Assignments',
    description: 'Total pages in the assignment document',
  },
  {
    path: 'assignmentBag.assignmentReceivedDate',
    label: 'Assignment Received Date',
    type: 'date',
    section: 'Assignments',
    description: 'Date the assignment was received',
  },
  {
    path: 'assignmentBag.assignmentRecordedDate',
    label: 'Assignment Recorded Date',
    type: 'date',
    section: 'Assignments',
    description: 'Date the assignment was recorded at USPTO',
  },
  {
    path: 'assignmentBag.assignmentMailedDate',
    label: 'Assignment Mailed Date',
    type: 'date',
    section: 'Assignments',
    description: 'Date the assignment was mailed to or received by the office',
  },
  {
    path: 'assignmentBag.imageAvailableStatusCode',
    label: 'Assignment Image Available',
    type: 'boolean',
    section: 'Assignments',
    description: 'Whether an image of the assignment is available',
  },
  {
    path: 'assignmentBag.conveyanceText',
    label: 'Conveyance Text',
    type: 'string',
    section: 'Assignments',
    description: 'Description of the interest conveyed or transaction recorded',
    example: 'ASSIGNMENT OF ASSIGNORS INTEREST',
  },

  // ═══════════════════════════════════════════
  // ASSIGNORS
  // ═══════════════════════════════════════════
  {
    path: 'assignmentBag.assignorBag.assignorName',
    label: 'Assignor Name',
    type: 'string',
    section: 'Assignors',
    description: 'Name of the party transferring patent rights',
    example: 'SHEN, GENE',
  },
  {
    path: 'assignmentBag.assignorBag.executionDate',
    label: 'Assignor Execution Date',
    type: 'date',
    section: 'Assignors',
    description: 'Date the assignment was executed per legal documentation',
  },

  // ═══════════════════════════════════════════
  // ASSIGNEES
  // ═══════════════════════════════════════════
  {
    path: 'assignmentBag.assigneeBag.assigneeNameText',
    label: 'Assignee Name',
    type: 'string',
    section: 'Assignees',
    description: 'Name of the entity receiving patent rights',
    example: 'PACIFIC BIOSCIENCES OF CALIFORNIA, INC.',
  },
  {
    path: 'assignmentBag.assigneeBag.assigneeAddress.addressLineOneText',
    label: 'Assignee Address (Line 1)',
    type: 'string',
    section: 'Assignees',
  },
  {
    path: 'assignmentBag.assigneeBag.assigneeAddress.cityName',
    label: 'Assignee City',
    type: 'string',
    section: 'Assignees',
  },
  {
    path: 'assignmentBag.assigneeBag.assigneeAddress.geographicRegionName',
    label: 'Assignee State/Region',
    type: 'string',
    section: 'Assignees',
  },
  {
    path: 'assignmentBag.assigneeBag.assigneeAddress.geographicRegionCode',
    label: 'Assignee State Code',
    type: 'string',
    section: 'Assignees',
    example: 'CA',
  },
  {
    path: 'assignmentBag.assigneeBag.assigneeAddress.countryName',
    label: 'Assignee Country',
    type: 'string',
    section: 'Assignees',
  },
  {
    path: 'assignmentBag.assigneeBag.assigneeAddress.postalCode',
    label: 'Assignee Postal Code',
    type: 'string',
    section: 'Assignees',
  },

  // ═══════════════════════════════════════════
  // ASSIGNMENT CORRESPONDENCE
  // ═══════════════════════════════════════════
  {
    path: 'assignmentBag.correspondenceAddress.correspondentNameText',
    label: 'Assignment Correspondent Name',
    type: 'string',
    section: 'Assignment Correspondence',
    description: 'Name of the assignment correspondent',
  },
  {
    path: 'assignmentBag.correspondenceAddress.addressLineOneText',
    label: 'Assignment Correspondent Address (Line 1)',
    type: 'string',
    section: 'Assignment Correspondence',
  },
  {
    path: 'assignmentBag.correspondenceAddress.addressLineTwoText',
    label: 'Assignment Correspondent Address (Line 2)',
    type: 'string',
    section: 'Assignment Correspondence',
  },

  // ═══════════════════════════════════════════
  // DOMESTIC REPRESENTATIVE
  // ═══════════════════════════════════════════
  {
    path: 'assignmentBag.domesticRepresentative.name',
    label: 'Domestic Representative Name',
    type: 'string',
    section: 'Domestic Representative',
  },
  {
    path: 'assignmentBag.domesticRepresentative.addressLineOneText',
    label: 'Domestic Representative Address',
    type: 'string',
    section: 'Domestic Representative',
  },
  {
    path: 'assignmentBag.domesticRepresentative.cityName',
    label: 'Domestic Representative City',
    type: 'string',
    section: 'Domestic Representative',
  },
  {
    path: 'assignmentBag.domesticRepresentative.postalCode',
    label: 'Domestic Representative Postal Code',
    type: 'string',
    section: 'Domestic Representative',
  },
  {
    path: 'assignmentBag.domesticRepresentative.geographicRegionName',
    label: 'Domestic Representative State/Region',
    type: 'string',
    section: 'Domestic Representative',
  },
  {
    path: 'assignmentBag.domesticRepresentative.countryName',
    label: 'Domestic Representative Country',
    type: 'string',
    section: 'Domestic Representative',
  },
  {
    path: 'assignmentBag.domesticRepresentative.emailAddress',
    label: 'Domestic Representative Email',
    type: 'string',
    section: 'Domestic Representative',
  },

  // ═══════════════════════════════════════════
  // ATTORNEY / AGENT
  // ═══════════════════════════════════════════
  {
    path: 'recordAttorney.customerNumberCorrespondenceData.patronIdentifier',
    label: 'Attorney Patron ID',
    type: 'string',
    section: 'Attorney / Agent',
    description: 'Unique identifier of the patron',
  },
  {
    path: 'recordAttorney.customerNumberCorrespondenceData.organizationStandardName',
    label: 'Attorney Organization',
    type: 'string',
    section: 'Attorney / Agent',
    description: 'Organization standard name',
  },
  {
    path: 'recordAttorney.powerOfAttorneyBag.firstName',
    label: 'Attorney First Name',
    type: 'string',
    section: 'Attorney / Agent',
  },
  {
    path: 'recordAttorney.powerOfAttorneyBag.middleName',
    label: 'Attorney Middle Name',
    type: 'string',
    section: 'Attorney / Agent',
  },
  {
    path: 'recordAttorney.powerOfAttorneyBag.lastName',
    label: 'Attorney Last Name',
    type: 'string',
    section: 'Attorney / Agent',
  },
  {
    path: 'recordAttorney.powerOfAttorneyBag.registrationNumber',
    label: 'Attorney Registration Number',
    type: 'number',
    section: 'Attorney / Agent',
    description: 'Attorney or agent registration number',
  },
  {
    path: 'recordAttorney.powerOfAttorneyBag.activeIndicator',
    label: 'Attorney Active Status',
    type: 'string',
    section: 'Attorney / Agent',
    description: 'Whether attorney is active or inactive',
    enumValues: ['ACTIVE', 'INACTIVE'],
  },
  {
    path: 'recordAttorney.powerOfAttorneyBag.registeredPractitionerCategory',
    label: 'Practitioner Category',
    type: 'string',
    section: 'Attorney / Agent',
    description: 'ATTNY (Attorney) or AGENT',
    enumValues: ['ATTNY', 'AGENT'],
  },

  // ═══════════════════════════════════════════
  // FOREIGN PRIORITY
  // ═══════════════════════════════════════════
  {
    path: 'foreignPriorityBag.ipOfficeName',
    label: 'Foreign IP Office',
    type: 'string',
    section: 'Foreign Priority',
    description: 'Name of the foreign IP office',
  },
  {
    path: 'foreignPriorityBag.filingDate',
    label: 'Foreign Priority Filing Date',
    type: 'date',
    section: 'Foreign Priority',
    description: 'Date the priority claim was filed',
  },
  {
    path: 'foreignPriorityBag.applicationNumberText',
    label: 'Foreign Application Number',
    type: 'string',
    section: 'Foreign Priority',
    description: 'Foreign application number',
  },

  // ═══════════════════════════════════════════
  // PARENT CONTINUITY
  // ═══════════════════════════════════════════
  {
    path: 'parentContinuityBag.parentApplicationNumberText',
    label: 'Parent Application Number',
    type: 'string',
    section: 'Parent Continuity',
    description: 'Application number of the parent application',
  },
  {
    path: 'parentContinuityBag.childApplicationNumberText',
    label: 'Child App Number (in parent bag)',
    type: 'string',
    section: 'Parent Continuity',
    description: 'Application number of the child application',
  },
  {
    path: 'parentContinuityBag.parentPatentNumber',
    label: 'Parent Patent Number',
    type: 'string',
    section: 'Parent Continuity',
    description: 'Patent number of the parent application',
  },
  {
    path: 'parentContinuityBag.parentApplicationStatusCode',
    label: 'Parent Status Code',
    type: 'number',
    section: 'Parent Continuity',
    description: 'Status code of the parent application',
  },
  {
    path: 'parentContinuityBag.parentApplicationStatusDescriptionText',
    label: 'Parent Status',
    type: 'string',
    section: 'Parent Continuity',
    description: 'Status description of the parent application',
    example: 'Patented Case',
  },
  {
    path: 'parentContinuityBag.parentApplicationFilingDate',
    label: 'Parent Filing Date',
    type: 'date',
    section: 'Parent Continuity',
    description: 'Filing date of the parent application',
  },
  {
    path: 'parentContinuityBag.claimParentageTypeCode',
    label: 'Parent Claim Type Code',
    type: 'string',
    section: 'Parent Continuity',
    description: 'Parentage type (CON, CIP, DIV)',
    enumValues: ['CON', 'CIP', 'DIV'],
  },
  {
    path: 'parentContinuityBag.claimParentageTypeCodeDescriptionText',
    label: 'Parent Claim Type Description',
    type: 'string',
    section: 'Parent Continuity',
    description: 'Description of parentage type',
    example: 'is a Continuation of',
  },
  {
    path: 'parentContinuityBag.firstInventorToFileIndicator',
    label: 'Parent AIA Indicator',
    type: 'boolean',
    section: 'Parent Continuity',
    description: 'AIA first-inventor-to-file indicator for parent',
  },

  // ═══════════════════════════════════════════
  // CHILD CONTINUITY
  // ═══════════════════════════════════════════
  {
    path: 'childContinuityBag.childApplicationNumberText',
    label: 'Child Application Number',
    type: 'string',
    section: 'Child Continuity',
    description: 'Application number of the child application',
  },
  {
    path: 'childContinuityBag.parentApplicationNumberText',
    label: 'Parent App Number (in child bag)',
    type: 'string',
    section: 'Child Continuity',
  },
  {
    path: 'childContinuityBag.childPatentNumber',
    label: 'Child Patent Number',
    type: 'string',
    section: 'Child Continuity',
    description: 'Patent number of the child application',
  },
  {
    path: 'childContinuityBag.childApplicationStatusCode',
    label: 'Child Status Code',
    type: 'string',
    section: 'Child Continuity',
  },
  {
    path: 'childContinuityBag.childApplicationStatusDescriptionText',
    label: 'Child Status',
    type: 'string',
    section: 'Child Continuity',
    description: 'Status of the child application',
  },
  {
    path: 'childContinuityBag.childApplicationFilingDate',
    label: 'Child Filing Date',
    type: 'date',
    section: 'Child Continuity',
  },
  {
    path: 'childContinuityBag.claimParentageTypeCode',
    label: 'Child Claim Type Code',
    type: 'string',
    section: 'Child Continuity',
    enumValues: ['CON', 'CIP', 'DIV'],
  },
  {
    path: 'childContinuityBag.claimParentageTypeCodeDescriptionText',
    label: 'Child Claim Type Description',
    type: 'string',
    section: 'Child Continuity',
  },
  {
    path: 'childContinuityBag.firstInventorToFileIndicator',
    label: 'Child AIA Indicator',
    type: 'boolean',
    section: 'Child Continuity',
  },

  // ═══════════════════════════════════════════
  // PATENT TERM ADJUSTMENT
  // ═══════════════════════════════════════════
  {
    path: 'patentTermAdjustmentData.aDelayQuantity',
    label: 'PTA A Delay (Days)',
    type: 'number',
    section: 'Patent Term Adjustment',
    description: 'USPTO delays under 35 U.S.C. § 154(b)(1)(A)',
  },
  {
    path: 'patentTermAdjustmentData.bDelayQuantity',
    label: 'PTA B Delay (Days)',
    type: 'number',
    section: 'Patent Term Adjustment',
    description: 'Delays for failing to issue within 3 years of filing',
  },
  {
    path: 'patentTermAdjustmentData.cDelayQuantity',
    label: 'PTA C Delay (Days)',
    type: 'number',
    section: 'Patent Term Adjustment',
    description: 'Delays from interference, secrecy orders, or appellate reviews',
  },
  {
    path: 'patentTermAdjustmentData.overlappingDayQuantity',
    label: 'PTA Overlapping Days',
    type: 'number',
    section: 'Patent Term Adjustment',
    description: 'Overlapping delay days',
  },
  {
    path: 'patentTermAdjustmentData.nonOverlappingDayQuantity',
    label: 'PTA Non-Overlapping Days',
    type: 'number',
    section: 'Patent Term Adjustment',
    description: 'Total USPTO delays minus overlapping days',
  },
  {
    path: 'patentTermAdjustmentData.applicantDayDelayQuantity',
    label: 'PTA Applicant Delay (Days)',
    type: 'number',
    section: 'Patent Term Adjustment',
    description: 'Applicant delay days under 35 U.S.C. § 154(b)(2)(C)',
  },
  {
    path: 'patentTermAdjustmentData.adjustmentTotalQuantity',
    label: 'PTA Total Adjustment (Days)',
    type: 'number',
    section: 'Patent Term Adjustment',
    description: 'Total patent term adjustment in days',
  },

  // ═══════════════════════════════════════════
  // PTA HISTORY
  // ═══════════════════════════════════════════
  {
    path: 'patentTermAdjustmentData.patentTermAdjustmentHistoryDataBag.eventDate',
    label: 'PTA Event Date',
    type: 'date',
    section: 'PTA History',
  },
  {
    path: 'patentTermAdjustmentData.patentTermAdjustmentHistoryDataBag.eventDescriptionText',
    label: 'PTA Event Description',
    type: 'string',
    section: 'PTA History',
    example: 'PTA 36 Months',
  },
  {
    path: 'patentTermAdjustmentData.patentTermAdjustmentHistoryDataBag.eventSequenceNumber',
    label: 'PTA Event Sequence Number',
    type: 'number',
    section: 'PTA History',
  },
  {
    path: 'patentTermAdjustmentData.patentTermAdjustmentHistoryDataBag.originatingEventSequenceNumber',
    label: 'PTA Originating Sequence Number',
    type: 'number',
    section: 'PTA History',
  },
  {
    path: 'patentTermAdjustmentData.patentTermAdjustmentHistoryDataBag.ptaPTECode',
    label: 'PTA/PTE Code',
    type: 'string',
    section: 'PTA History',
    enumValues: ['PTA', 'PTE'],
  },
  {
    path: 'patentTermAdjustmentData.patentTermAdjustmentHistoryDataBag.ipOfficeDayDelayQuantity',
    label: 'PTA USPTO Manual Adjustment Days',
    type: 'number',
    section: 'PTA History',
    description: 'Days of USPTO manual adjustment to PTA',
  },
  {
    path: 'patentTermAdjustmentData.patentTermAdjustmentHistoryDataBag.applicantDayDelayQuantity',
    label: 'PTA History Applicant Delay Days',
    type: 'number',
    section: 'PTA History',
  },

  // ═══════════════════════════════════════════
  // PROSECUTION EVENTS
  // ═══════════════════════════════════════════
  {
    path: 'eventDataBag.eventCode',
    label: 'Event Code',
    type: 'string',
    section: 'Prosecution Events',
    description: 'Unique reference code for a prosecution transaction',
    example: 'PGM/',
  },
  {
    path: 'eventDataBag.eventDescriptionText',
    label: 'Event Description',
    type: 'string',
    section: 'Prosecution Events',
    description: 'Description of the prosecution event',
    example: 'Recordation of Patent Grant Mailed',
  },
  {
    path: 'eventDataBag.eventDate',
    label: 'Event Date',
    type: 'date',
    section: 'Prosecution Events',
    description: 'Date the event was recorded',
  },

  // ═══════════════════════════════════════════
  // PRE-GRANT PUBLICATION DOCUMENT
  // ═══════════════════════════════════════════
  {
    path: 'pgpubDocumentMetaData.zipFileName',
    label: 'PgPub Zip File Name',
    type: 'string',
    section: 'Pre-Grant Publication',
  },
  {
    path: 'pgpubDocumentMetaData.productIdentifier',
    label: 'PgPub Product Identifier',
    type: 'string',
    section: 'Pre-Grant Publication',
    example: 'APPXML',
  },
  {
    path: 'pgpubDocumentMetaData.fileLocationURI',
    label: 'PgPub File Location URI',
    type: 'string',
    section: 'Pre-Grant Publication',
  },
  {
    path: 'pgpubDocumentMetaData.fileCreateDateTime',
    label: 'PgPub File Created Date',
    type: 'date',
    section: 'Pre-Grant Publication',
  },
  {
    path: 'pgpubDocumentMetaData.xmlFileName',
    label: 'PgPub XML File Name',
    type: 'string',
    section: 'Pre-Grant Publication',
  },

  // ═══════════════════════════════════════════
  // GRANT DOCUMENT
  // ═══════════════════════════════════════════
  {
    path: 'grantDocumentMetaData.zipFileName',
    label: 'Grant Zip File Name',
    type: 'string',
    section: 'Grant Document',
  },
  {
    path: 'grantDocumentMetaData.productIdentifier',
    label: 'Grant Product Identifier',
    type: 'string',
    section: 'Grant Document',
    example: 'PTGRXML',
  },
  {
    path: 'grantDocumentMetaData.fileLocationURI',
    label: 'Grant File Location URI',
    type: 'string',
    section: 'Grant Document',
  },
  {
    path: 'grantDocumentMetaData.fileCreateDateTime',
    label: 'Grant File Created Date',
    type: 'date',
    section: 'Grant Document',
  },
  {
    path: 'grantDocumentMetaData.xmlFileName',
    label: 'Grant XML File Name',
    type: 'string',
    section: 'Grant Document',
  },
];
