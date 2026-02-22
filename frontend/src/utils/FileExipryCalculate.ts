export const FileExipryCalculate = (expiresIn: number) => {
  if (expiresIn === 1) {
    return '1 hour';
  } else if (expiresIn === 24) {
    return '24 hours';
  } else {
    return 'Please select the License';
  }
};
