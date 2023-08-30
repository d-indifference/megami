/**
 * Entity Creation Result DTO
 */
export class CreationResultDto<T> {
	/**
	 * Identifier of new entity
	 */
	id: T;

	constructor(id?: T) {
		if (id) {
			this.id = id;
		}
	}
}
