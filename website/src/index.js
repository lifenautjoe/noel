
require('normalize.css/normalize.css');
require('./assets/highlight.css');

document.addEventListener("DOMContentLoaded", () => {
    hljs.initHighlightingOnLoad();
});

require('./styles/index.scss');
