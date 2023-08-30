import { Page } from './page.type';
import { ThreadItemDto } from '../../thread/dto/thread.item.dto';

/**
 * Create a thread paginator
 * @param page Page with threads
 */
export const makePaginatorTemplate = (page: Page<ThreadItemDto>): string => {
	// Should be converted to handlebars helpers...
	let pagination = `<nav aria-label="Thread Pagination" class="mt-4">
			<ul class="pagination">`;

	if (page.previous) {
		pagination += `<li class="page-item">
			<a class="page-link" href="/${page.elements[0].boardSlug}/${page.previous}">
				Previous
			</a>
		</li>`;
	} else {
		pagination += `<li class="page-item disabled">
      		<span class="page-link">Previous</span>
    	</li>`;
	}

	if (Number(page.current) >= 3) {
		pagination += `<li class="page-item">
			<a class="page-link" href="/${page.elements[0].boardSlug}/1">
				1
			</a>
		</li>`;
	}

	if (Number(page.previous) - 1 > 1) {
		pagination += `<li class="page-item disabled">
      		<span class="page-link">...</span>
    	</li>`;
	}

	if (page.previous) {
		pagination += `<li class="page-item">
			<a class="page-link" href="/${page.elements[0].boardSlug}/${page.previous}">
				${page.previous}
			</a>
		</li>`;
	}

	pagination += `<li class="page-item active" aria-current="page">
    	<span class="page-link">${page.current}</span>
    </li>`;

	if (page.next) {
		pagination += `<li class="page-item">
			<a class="page-link" href="/${page.elements[0].boardSlug}/${page.next}">
				${page.next}
			</a>
		</li>`;
	}

	if (Number(page.total) - Number(page.next) > 1) {
		pagination += `<li class="page-item disabled">
      		<span class="page-link">...</span>
    	</li>`;
	}

	if (Number(page.total) - Number(page.current) > 1) {
		pagination += `<li class="page-item">
			<a class="page-link" href="/${page.elements[0].boardSlug}/${page.total}">
				${page.total}
			</a>
		</li>`;
	}

	if (page.next) {
		pagination += `<li class="page-item">
			<a class="page-link" href="/${page.elements[0].boardSlug}/${page.next}">
				Next
			</a>
		</li>`;
	} else {
		pagination += `<li class="page-item disabled">
      		<span class="page-link">Next</span>
    	</li>`;
	}

	pagination += ' </ul></nav>';

	return pagination;
};
