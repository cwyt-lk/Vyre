export const MENU_ITEMS = [
	{ href: "/home", label: "Home" },
	{ href: "/music/albums", label: "Albums" },
	{ href: "/credits", label: "Credits" },
] as const;

export const ADMIN_SECTIONS = {
	create: [
		{
			href: "/admin/albums/create",
			title: "Add Album",
			description: "Create a new album.",
		},
		{
			href: "/admin/tracks/create",
			title: "Add Track",
			description: "Upload new tracks.",
		},
		{
			href: "/admin/genres/create",
			title: "Add Genre",
			description: "Expand library categories.",
		},
		{
			href: "/admin/artists/create",
			title: "Add Artist",
			description: "Add a new artist.",
		},
	],
	view: [
		{
			href: "/admin/albums",
			title: "View Albums",
			description: "Manage existing collections.",
		},
		{
			href: "/admin/tracks",
			title: "View Tracks",
			description: "Edit uploaded tracks.",
		},
		{
			href: "/admin/genres",
			title: "View Genres",
			description: "Review categories.",
		},
		{
			href: "/admin/artists",
			title: "View Artists",
			description: "Manage artist profiles.",
		},
	],
} as const;
