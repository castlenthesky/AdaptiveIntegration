import { isNumberedValue } from "../helpers";

export async function processAccountAttributes(objectToTraverse: any) {
  let accountCategorizationStructure: any[] = [];
  // Extract basic array from Adaptive response object
  const categorizationArray =
    objectToTraverse.attributes[0].attribute[0].attributeValue;

  // Iterate through the layers of the response object
  categorizationArray.map((reportElement: any) => {
    if ("attributeValue" in reportElement) {
      const reportName = reportElement["$"].name;
      reportElement.attributeValue.map((categoryElement: any) => {
        if ("attributeValue" in categoryElement) {
          const categoryName = categoryElement["$"].name;
          categoryElement.attributeValue.map((subcategoryElement: any) => {
            const subcategoryName = subcategoryElement["$"].name;
            const categorizationObject = {
              reportingGroup: reportName,
              reportingCategory: categoryName,
              reportingSubcategory: subcategoryName,
            };
            accountCategorizationStructure.push(categorizationObject);
          });
        }
      });
    }
  });
  return accountCategorizationStructure;
}

export async function processAccounts(rawAccountObject: any) {
  let accountGroupArray = rawAccountObject.accounts[0].account;

  // Find GL Account Object
  let glAccountGroupArray = {};
  accountGroupArray.map((accountGroup: any) => {
    if (accountGroup["$"].name === "GL Accounts") {
      return (glAccountGroupArray = accountGroup.account);
    } else {
      return;
    }
  });
  const accountDetails = extractAccountDetails(glAccountGroupArray, []);
  return accountDetails;
}

function extractAccountDetails(objectToTraverse: any, resultSet: any) {
  // let resultSet: any[] = [];
  if (Array.isArray(objectToTraverse)) {
    objectToTraverse.forEach((childObject) => {
      resultSet.concat(extractAccountDetails(childObject, resultSet));
    });
  } else if (
    objectHasSuccessObject(objectToTraverse) &&
    objectHasAccountArray(objectToTraverse)
  ) {
    resultSet.concat(
      extractAccountDetails(objectToTraverse.account, resultSet),
    );
  } else if (
    objectHasSuccessObject(objectToTraverse) &&
    objectHasNumericCode(objectToTraverse) &&
    objectHasReportingCategory(objectToTraverse)
  ) {
    resultSet.push(buildAccountDetail(objectToTraverse));
  }
  return resultSet;
}

function objectHasSuccessObject(objectToCheck: { $?: {} }) {
  return "$" in objectToCheck ? true : false;
}

function objectHasAccountArray(objectToCheck: { account?: string }) {
  if (objectToCheck.account) {
    return true;
  } else {
    return false;
  }
}

function buildAccountDetail(baseObject: any) {
  return {
    accountName: baseObject["$"].name,
    accountCode: Number(baseObject["$"].code),
    accountGroup: getReportingCategory(baseObject),
  };
}

function objectHasNumericCode(objecToCheck: any) {
  if (objecToCheck["$"].code) {
    return new RegExp(isNumberedValue).test(objecToCheck["$"].code);
  } else {
    return false;
  }
}

function objectHasReportingCategory(objectToCheck: any) {
  let hasReportingCategorization = false;
  if (objectToCheck.attributes) {
    objectToCheck.attributes.forEach((element: any) => {
      if (element.attribute) {
        element.attribute.forEach((attribute: any) => {
          if (attribute["$"].name === "Reporting Categorization") {
            hasReportingCategorization = true;
          }
        });
      }
    });
  }
  return hasReportingCategorization;
}

function getReportingCategory(objectToCheck: any): any {
  let reportingCategorization = null;
  if (objectToCheck.attributes) {
    objectToCheck.attributes.forEach((element: any) => {
      if (element.attribute) {
        element.attribute.forEach((attribute: any) => {
          if (attribute["$"].name === "Reporting Categorization") {
            reportingCategorization = attribute["$"].value;
          }
        });
      }
    });
  }
  return reportingCategorization;
}
