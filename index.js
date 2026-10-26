window.addEventListener('load', async () => {
    const copyBtnElement = document.querySelector('#copy-btn');
    const wordlistElement = document.querySelector('#wordlist > pre');

     const fetchList = file => fetch(file)
         .then(r => r.text())
         .then(raw =>
             raw
                 .replaceAll(/(?<=^|\n)#[^\n]+/g, '')
                 .split(/[\r\n]+/)
                 .map(it => it.trim())
                 .filter(it => !!it)
         );

    let words = [];
    const lists = await fetchList('/lists.txt');
    for (const list of lists) {
        words = [...words, ...(await fetchList(`/lists/${list}.txt`))];
    }

    document.body.removeAttribute('data-loading');
    wordlistElement.textContent = words.join(', ');
    copyBtnElement.addEventListener('click', () => {
        copyBtnElement.setAttribute('data-copied', '');
        navigator.clipboard.writeText(words.join(','));
        setTimeout(() => copyBtnElement.removeAttribute('data-copied'), 800);
    });
});
