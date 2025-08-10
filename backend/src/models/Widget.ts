import { Schema, model, InferSchemaType } from 'mongoose';

const widgetSchema = new Schema(
  {
    location: { type: String, required: true, trim: true },
    locationKey: { type: String, required: true, index: true, unique: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  },
);

widgetSchema.index({ locationKey: 1 }, { unique: true, name: 'unique_location_key' });

export type WidgetDoc = InferSchemaType<typeof widgetSchema> & { _id: string };

const Widget = model('Widget', widgetSchema, 'widgets');

export default Widget;
