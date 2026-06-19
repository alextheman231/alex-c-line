import resolveLicense from "src/utility/licenses/resolveLicense";

function isValidLicense(license: string, allowedLicenses: Array<string>): boolean {
  return resolveLicense(license).some((license) => {
    return allowedLicenses.includes(license);
  });
}

export default isValidLicense;
