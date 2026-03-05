async function attachText(testInfo, name, content) {
  await testInfo.attach(name, {
    body: Buffer.from(content, 'utf-8'),
    contentType: 'text/plain'
  });
}

module.exports = {
  attachText
};
