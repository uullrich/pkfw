import Widget, { WidgetDoc } from '../models/Widget';

/**
 * Returns all widgets sorted by newest first.
 *
 * @returns List of all widgets
 */
export async function listWidgets(): Promise<WidgetDoc[]> {
  const widgets = await Widget.find().sort({ createdAt: -1 }).lean();
  return widgets.map((widget) => ({ ...widget, _id: widget._id.toString() }));
}

/**
 * Creates a new widget for the given location.
 *
 * @param location Given location
 * @returns Created widget from the database
 */
export async function createWidget(location: string): Promise<WidgetDoc> {
  const normalized = location.trim();
  const created = await Widget.create({ location: normalized });
  return { ...created.toObject(), _id: created._id.toString() };
}

/**
 * Deletes a widget by MongoDB _id.
 *
 * @param id Widget identifier
 * @returns true if a document was deleted
 */
export async function deleteWidgetById(id: string): Promise<boolean> {
  const res = await Widget.findByIdAndDelete(id);
  return res !== null;
}
