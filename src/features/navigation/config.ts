export const MENU_ITEMS = [
	{ href: "/home", label: "Home" },
	{ href: "/music/albums", label: "Albums" },
] as const;

export const ADMIN_SECTIONS = {
	create: [
		{
			href: "/admin/albums/create",
			title: "Add Album",
			description: "Create a new album collection.",
		},
		{
			href: "/admin/tracks/create",
			title: "Add Track",
			description: "Upload new tracks and metadata.",
		},
		{
			href: "/admin/genres/create",
			title: "Add Genre",
			description: "Expand library categories.",
		},
		{
			href: "/admin/artists/create",
			title: "Add Artist",
			description: "Add a new artist profile.",
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
			href: "/admin/artists",
			title: "View Artists",
			description: "Manage artist profiles.",
		},
		{
			href: "/admin/genres",
			title: "View Genres",
			description: "Review categories.",
		},
	],
} as const;
