/**
 * Navigation Types
 * Centralized type definitions for all navigation-related components
 */

/**
 * Represents a menu item in the main navigation
 */
export interface MenuItem {
	href: string;
	label: string;
}

/**
 * Represents an admin section item (for create/view sections)
 */
export interface AdminSectionItem {
	href: string;
	title: string;
	description: string;
}

/**
 * Admin sections container with create and view subsections
 */
export interface AdminSections {
	create: AdminSectionItem[];
	view: AdminSectionItem[];
}
