import { SiteSettings } from '../types/site-settings.type';

const descriptionInit = `Some description for this site. 
It fully supports HTML5 markdown + <a href="https://getbootstrap.com/">Boostrap</a>`;

const boardBottomLinksInit = '[<a href="/b">b</a>]';

const faqHtmlInit = `
<h3>Post markdown</h3>
<p>
Megami supports markup language that resembles both Wakaba-mark and Markdown.
</p>
<h4 class="mt-3">Reflinks</h4>
<p>
Replies and threads can be referenced by their number:
<a href="#">&gt;&gt;180000</a>
Reflinks on separate lines will add post as reply to referenced post.
If reflink on line with other text, post will be added as reference.
</p>
<h4 class="mt-3">Inline tags</h4>
<table class="table">
<thead>
<tr>
<th scope="col">Input</th>
<th scope="col">Output</th>
</tr>
</thead>
<tbody>
<tr>
<td>*italic*</td>
<td><i>italic</i></td>
</tr>
<tr>
<td>**bold**</td>
<td><b>bold</b></td>
</tr>
<tr>
<td>~~strike through~~</td>
<td><s>strike through</s></td>
</tr>
<tr>
<td>%%spoiler%%</td>
<td><span class="custom-spoiler">spoiler</span></td>
</tr>
<tr>
<td>!~cow text~!</td>
<td><span class="custom-cow">cow text</span></td>
</tr>
<tr>
<td>\`inline code\`</td>
<td><code>inline code</code></td>
</tr>
<tr>
<td>&gt; quote</td>
<td><span class="custom-unkfunc">&gt; quote</span></td>
</tr>
<tr>
<td>\`\`\`aaゆっくりしていってね！！！\`\`\`</td>
<td><code class="custom-code-aa">ゆっくりしていってね！！！</code></td>
</tr>
</tbody>
</table>

<p>
If you post a url starting with either http:// or https://, it will automatically be linked. <br>
Attribute rel="noreferrer" is added to links in posts.
</p>`;

const rulesHtmlInit = `
<p>
Global site rules:
</p>
<ol>
<li>No CP</li>
<li>No shitposting</li>
<li>Moderator is always right</li>
</ol>
`;

/**
 * Make default initial site settings
 */
export const makeInitialSettings = (): SiteSettings => {
	return {
		title: 'Megami Image Board',
		slogan: 'Modern image board engine',
		description: descriptionInit,
		boardBottomLinks: boardBottomLinksInit,
		threadCreationDelay: 30,
		threadReplyDelay: 15,
		mainPageLogoAddress: '/img/logo-512.png',
		bumpLimit: 100,
		faqHtml: faqHtmlInit,
		rulesHtml: rulesHtmlInit
	};
};
