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

/**
 * Renders the appropriate icon for a given scholarship form field type.
 * @param fieldType - The form field type (FormFieldType enum value)
 * @param iconProps - Optional overrides for size and className (default: size 18, text-secondary)
 * @returns Icon component for the field type
 */
export function renderFieldTypeIcon(
	fieldType: FormFieldType,
	iconProps: { size?: number; className?: string } = DEFAULT_ICON_PROPS
): React.ReactNode {
	const props = { ...DEFAULT_ICON_PROPS, ...iconProps };

	switch (fieldType) {
		case FormFieldType.ShortAnswer:
			return <TypeIcon {...props} />;
		case FormFieldType.Paragraph:
			return <AlignLeft {...props} />;
		case FormFieldType.Dropdown:
		case FormFieldType.MultipleChoice:
			return <ListChecks {...props} />;
		case FormFieldType.Checkbox:
			return <CheckSquare {...props} />;
		case FormFieldType.Number:
			return <Hash {...props} />;
		case FormFieldType.Date:
			return <CalendarIcon {...props} />;
		case FormFieldType.Email:
			return <Mail {...props} />;
		case FormFieldType.Phone:
			return <Phone {...props} />;
		case FormFieldType.File:
			return <Paperclip {...props} />;
		default:
			return <TypeIcon {...props} />;
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
