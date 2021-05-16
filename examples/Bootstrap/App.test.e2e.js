// @ts-check

import 'regenerator-runtime/runtime';

jest.setTimeout(20000); // 20s

function indent(text, indentation) {
  return (
    text
      // [Add a char to the start of each line in JavaScript using regular expression](https://stackoverflow.com/q/11939575)
      .replace(/^/gm, indentation)
      // [Trim trailing spaces before newlines in a single multi-line string in JavaScript](https://stackoverflow.com/q/5568797)
      .replace(/[^\S\n]+$/gm, '')
  );
}

beforeEach(async () => {
  await page.goto('http://localhost:8080');
});

test('john/123456/12345', async () => {
  const username = await page.$('input[name=username]');
  await username.click();
  await username.type('john');
  await page.waitForSelector('input[name=username] ~ span[data-feedback].invalid-feedback');
  //const usernameFeedbacks = await page.$$('input[name=username] ~ span[data-feedback]');
  const usernameFeedbacks = await username.$x('./following-sibling::span[@data-feedback]');
  expect(usernameFeedbacks).toHaveLength(1);
  expect(usernameFeedbacks[0]).toMatch('Username already taken, choose another');

  const password = await page.$('input[name=password]');
  await password.click();
  await password.type('123456');
  await page.waitForSelector('input[name=password] ~ span[data-feedback]');
  const passwordFeedbacks = await page.$$('input[name=password] ~ span[data-feedback]');
  expect(passwordFeedbacks).toHaveLength(4);
  expect(passwordFeedbacks[0]).toMatch('Should contain small letters');
  expect(passwordFeedbacks[1]).toMatch('Should contain capital letters');
  expect(passwordFeedbacks[2]).toMatch('Should contain special characters');
  expect(passwordFeedbacks[3]).toMatch('Looks good!');

  const passwordConfirm = await page.$('input[name=passwordConfirm]');
  await passwordConfirm.click();
  await passwordConfirm.type('12345');
  const passwordConfirmFeedbacks = await page.$$(
    'input[name=passwordConfirm] ~ span[data-feedback]'
  );
  expect(passwordConfirmFeedbacks).toHaveLength(1);
  expect(passwordConfirmFeedbacks[0]).toMatch('Not the same password');

  const signUp = (await page.$x("//button[text() = 'Sign Up']"))[0];
  // [Get Custom Attribute value](https://github.com/GoogleChrome/puppeteer/issues/1451)
  const disabled = await page.evaluate(el => el.getAttribute('disabled'), signUp);
  expect(disabled).toEqual('');
});

test('jimmy/12345/12345', async () => {
  const username = await page.$('input[name=username]');
  await username.click();
  await username.type('jimmy');
  await page.waitForSelector('input[name=username] ~ span[data-feedback].valid-feedback');
  //const usernameFeedbacks = await page.$$('input[name=username] ~ span[data-feedback]');
  const usernameFeedbacks = await username.$x('./following-sibling::span[@data-feedback]');
  expect(usernameFeedbacks).toHaveLength(2);
  expect(usernameFeedbacks[0]).toMatch('Username available');
  expect(usernameFeedbacks[1]).toMatch('Looks good!');

  const password = await page.$('input[name=password]');
  await password.click();
  await password.type('12345');
  await page.waitForSelector('input[name=password] ~ span[data-feedback]');
  const passwordFeedbacks = await page.$$('input[name=password] ~ span[data-feedback]');
  expect(passwordFeedbacks).toHaveLength(4);
  expect(passwordFeedbacks[0]).toMatch('Should contain small letters');
  expect(passwordFeedbacks[1]).toMatch('Should contain capital letters');
  expect(passwordFeedbacks[2]).toMatch('Should contain special characters');
  expect(passwordFeedbacks[3]).toMatch('Looks good!');

  const passwordConfirm = await page.$('input[name=passwordConfirm]');
  await passwordConfirm.click();
  await passwordConfirm.type('12345');
  const passwordConfirmFeedbacks = await page.$$(
    'input[name=passwordConfirm] ~ span[data-feedback]'
  );
  expect(passwordConfirmFeedbacks).toHaveLength(1);
  expect(passwordConfirmFeedbacks[0]).toMatch('Looks good!');

  const signUp = (await page.$x("//button[text() = 'Sign Up']"))[0];
  // [Get Custom Attribute value](https://github.com/GoogleChrome/puppeteer/issues/1451)
  const disabled = await page.evaluate(el => el.getAttribute('disabled'), signUp);
  expect(disabled).toEqual(null);

  const dialog = await expect(page).toDisplayDialog(async () => {
    await signUp.click();
  });
  expect(indent(dialog.message(), '    ')).toEqual(`\
    Valid form

    inputs =
    {
      "username": "jimmy",
      "password": "12345",
      "passwordConfirm": "12345"
    }`);
  await dialog.accept();
});
