import { albums } from "./assets.js";
import { galleryAlbums, achievementAlbums } from "./school.js";

// Album metadata from the live site joined to whatever photography actually
// landed locally. Albums with no downloadable images are reported, not faked.
const byFolder = new Map(Object.values(albums).map((album) => [album.folder, album]));

const resolve = (list) =>
  list
    .map((album) => ({ ...album, images: byFolder.get(album.folder)?.images ?? [] }))
    .filter((album) => album.images.length > 0);

export const gallery = resolve(galleryAlbums);
export const achievements = resolve(achievementAlbums);

export const missingAlbums = [...galleryAlbums, ...achievementAlbums]
  .filter((album) => (byFolder.get(album.folder)?.images ?? []).length === 0)
  .map((album) => album.title);

export const allGalleryImages = gallery.flatMap((album) => album.images);

export const albumCover = (album) => album.images[0];
