export const sprinklerModuleAssetSchema = {
  $id: "lisk/sprinkler/usernames",
  type: "object",
  required: ["registeredUsernames"],
  properties: {
    registeredUsernames: {
      type: "array",
      fieldNumber: 1,
      items: {
        type: "object",
        required: ["id", "username", "ownerAddress"],
        properties: {
          id: {
            dataType: "bytes",
            fieldNumber: 1,
          },
          username: {
            dataType: "string",
            fieldNumber: 2,
          },
          ownerAddress: {
            dataType: "bytes",
            fieldNumber: 3,
          },
        },
      },
    },
  },
};

export const sprinkleTransactionAssetSchema = {
  $id: "lisk/sprinkler/sprinkle",
  type: "object",
  required: ["username"],
  properties: {
    username: {
      fieldNumber: 1,
      dataType: "string",
      minLength: 3,
      maxLength: 50
    }
  }
}