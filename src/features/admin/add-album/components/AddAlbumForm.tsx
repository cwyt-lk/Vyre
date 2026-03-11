"use client";

import { Edit, X } from "lucide-react";

import { FormFileUploadField, FormInputField } from "@/components/form";
import { FormDatePickerField } from "@/components/form/FormDatePickerField";
import { FormTextareaField } from "@/components/form/FormTextareaField";
import { Button } from "@/components/ui/Button";
import { FieldGroup, FieldSet } from "@/components/ui/Field";
import { Separator } from "@/components/ui/Separator";
import { AddAlbumActions } from "@/features/admin/add-album/components/AddAlbumActions";
import { AddAlbumHeader } from "@/features/admin/add-album/components/AddAlbumHeader";
import { AddAlbumTracksDialog } from "@/features/admin/add-album/components/AddAlbumTracksDialog";
import { useAddAlbumForm } from "@/features/admin/add-album/hooks/useAddAlbumForm";
import { MAX_IMAGE_SIZE } from "@/features/admin/add-album/schema";
import { getHumanSize } from "@/lib/utils/file";
import type { Track } from "@/types/domain";

interface AddAlbumFormProps {
	tracks: Track[];
}

export function AddAlbumForm({ tracks }: AddAlbumFormProps) {
	const { form, isSubmitting } = useAddAlbumForm();

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
			className="w-full"
		>
			<FieldGroup className="p-4">
				<AddAlbumHeader />

				<FieldSet className="mt-8 space-y-6">
					<form.Field name="title">
						{(field) => (
							<FormInputField
								field={field}
								label="Album Title"
								icon={
									<Edit className="size-4 opacity-70" />
								}
								placeholder="Enter album title"
							/>
						)}
					</form.Field>

					<form.Field name="releaseDate">
						{(field) => (
							<FormDatePickerField
								field={field}
								label="Release Date"
								placeholder="Enter a Date"
							/>
						)}
					</form.Field>

					<form.Field name="description">
						{(field) => (
							<FormTextareaField
								field={field}
								label="Description"
								placeholder="Brief description (optional)..."
								maxLength={300}
							/>
						)}
					</form.Field>

					<Separator />

					{/* Track Selection */}
					<form.Field name="trackIds">
						{(field) => {
							const selectedTracks = tracks.filter((track) =>
								field.state.value?.includes(track.id),
							);

							function addTrack(trackId: string) {
								if (
									!field.state.value?.includes(trackId)
								) {
									field.handleChange([
										...(field.state.value ?? []),
										trackId,
									]);
								}
							}

							function removeTrack(trackId: string) {
								field.handleChange(
									field.state.value?.filter(
										(id) => id !== trackId,
									),
								);
							}

							return (
								<div className="space-y-3">
									<label
										className="text-sm font-medium"
										htmlFor={field.name}
									>
										Tracks
									</label>

									{/* Selected tracks */}
									<div className="border rounded-md p-3 space-y-2">
										{selectedTracks.length === 0 && (
											<p className="text-sm text-muted-foreground">
												No tracks added
											</p>
										)}

										{selectedTracks.map(
											(track, index) => (
												<div
													key={track.id}
													className="flex items-center justify-between text-sm"
												>
													<span>
														{index + 1}.{" "}
														{track.title}
													</span>

													<Button
														type="button"
														variant="ghost"
														size="icon"
														onClick={() =>
															removeTrack(
																track.id,
															)
														}
													>
														<X className="size-4" />
													</Button>
												</div>
											),
										)}
									</div>

									{/* Dialog picker */}
									<AddAlbumTracksDialog
										tracks={tracks}
										selected={field.state.value ?? []}
										onAdd={addTrack}
									/>
								</div>
							);
						}}
					</form.Field>

					<Separator />

					{/* Cover Image */}
					<form.Field name="coverFile">
						{(field) => (
							<FormFileUploadField
								field={field}
								label="Image File"
								description={`Max size: ${getHumanSize(MAX_IMAGE_SIZE)}`}
								accept={{ "image/*": [] }}
							/>
						)}
					</form.Field>
				</FieldSet>

				<AddAlbumActions
					isSubmitting={isSubmitting}
					onReset={() => form.reset()}
				/>
			</FieldGroup>
		</form>
	);
}
