import { FormFieldType } from "./model";

export function validateFormField(
	fieldType: FormFieldType,
	numOfOptions: number,
) {
	const typesWithOptions = [
		FormFieldType.MultipleChoice,
		FormFieldType.Dropdown,
		FormFieldType.Checkbox,
	];

	if (typesWithOptions.includes(fieldType)) {
		return numOfOptions > 0;
	}

	return numOfOptions === 0;
}
