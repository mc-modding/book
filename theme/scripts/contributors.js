(() => {

    window.addEventListener('load', () =>
    {
        let containerElem = document.querySelector('article .contributors');
        let filePath = getFilePath(containerElem.getAttribute('data-url'));
    
        let url = 'https://api.github.com/repos/mc-modding/book/commits?path=' + filePath;

        fetch(url)
            .then(response => response.json())
            .then(json =>
                {
                    if (!Array.isArray(json))
                        return;

                    let authors = {};

                    json.forEach(commit => authors[commit.author.login] = { 
                        login: commit.author.login,
                        avatar: commit.author.avatar_url,
                        url: commit.author.html_url
                    });

                    renderContributors(authors);
                });

        function getFilePath(editUrl)
        {
            return editUrl.replace('https://github.com/mc-modding/book/edit/main/', '');
        }

        function renderContributors(authors)
        {
            let h2 = document.createElement('h2');
                h2.innerHTML = `Вклад внесли <span>${Object.keys(authors).length}</span>`;

            let ul = document.createElement('ul');
                ul.append(...Object.values(authors).map(author =>
                {
                    let li = document.createElement('li');
                        li.innerHTML = `<a href="${author.url}" title="${author.login}" target="_blank"><img src="${author.avatar}"></a>`;

                    return li;
                }));

            containerElem.append(h2, ul);
            containerElem.removeAttribute('style');
        }
    });

})();