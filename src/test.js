describe('Token', function () {
  let near;
  let contract;
  let accountId;

  beforeAll(async function () {
    console.log('nearConfig', nearConfig);
    near = await nearlib.connect(nearConfig);
    accountId = nearConfig.contractName;
    contract = await near.loadContract(nearConfig.contractName, {
      viewMethods: ['getAllPhone'],
    changeMethods: ['addPhone', 'deletePhone'], 
      sender: accountId
    });
  });

  describe('phone book', function () {
    it('add contact', async function () {
      const startCounter = await contract.addPhone();
    });
    it('delete contact', async function () {
      await contract.deletePhone({value: 1});
    });
  });
});
