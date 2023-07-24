export const validateAddress = (input: string) => {
  // TODO: temporary hack for inj addresses - fix this with proper regex depending on selected chain
  var regex = /((terra|inj)([a-z0-9]{39}|[a-z0-9]{59})\b)|(terravaloper[a-z0-9]{39}\b)|([a-z0-9-]+\.ust\b)/;
  if (regex.test(input)) {
    return undefined;
  } else {
    return 'Invalid address input.';
  }
};
