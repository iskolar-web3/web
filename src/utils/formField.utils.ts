import React from "react";
import {
	Type as TypeIcon,
	AlignLeft,
	ListChecks,
	CheckSquare,
	Hash,
	Mail,
	Phone,
	Paperclip,
	CalendarIcon,
} from "lucide-react";
import { FormFieldType } from "@/lib/scholarship/model";

const DEFAULT_ICON_PROPS = { size: 18, className: "text-secondary" } as const;

export function renderFieldTypeIcon(
	fieldType: FormFieldType,
	iconProps: { size?: number; className?: string } = DEFAULT_ICON_PROPS
): React.ReactNode {
	const props = { ...DEFAULT_ICON_PROPS, ...iconProps };

	switch (fieldType) {
		case FormFieldType.ShortAnswer:
			return React.createElement(TypeIcon, props);
		case FormFieldType.Paragraph:
			return React.createElement(AlignLeft, props);
		case FormFieldType.Dropdown:
		case FormFieldType.MultipleChoice:
			return React.createElement(ListChecks, props);
		case FormFieldType.Checkbox:
			return React.createElement(CheckSquare, props);
		case FormFieldType.Number:
			return React.createElement(Hash, props);
		case FormFieldType.Date:
			return React.createElement(CalendarIcon, props);
		case FormFieldType.Email:
			return React.createElement(Mail, props);
		case FormFieldType.Phone:
			return React.createElement(Phone, props);
		case FormFieldType.File:
			return React.createElement(Paperclip, props);
		default:
			return React.createElement(TypeIcon, props);
	}
}

/**
 * Returns the human-readable label for a scholarship form field type.
 * @param fieldType - The form field type (FormFieldType enum value)
 * @returns Display label for the field type
 */
export function getFieldTypeLabel(fieldType: FormFieldType): string {
	switch (fieldType) {
		case FormFieldType.ShortAnswer:
			return "Short answer";
		case FormFieldType.Paragraph:
			return "Long answer";
		case FormFieldType.MultipleChoice:
			return "Multiple choice";
		case FormFieldType.Dropdown:
			return "Dropdown";
		case FormFieldType.Checkbox:
			return "Checkbox";
		case FormFieldType.Number:
			return "Number";
		case FormFieldType.Date:
			return "Date";
		case FormFieldType.Email:
			return "Email";
		case FormFieldType.Phone:
			return "Phone number";
		case FormFieldType.File:
			return "File upload";
		default:
			return "IDK";
	}
}