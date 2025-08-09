import { Schema, model, InferSchemaType } from 'mongoose';

const widgetSchema = new Schema(
  {
    location: { type: String, required: true, trim: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  },
);

export type WidgetDoc = InferSchemaType<typeof widgetSchema> & { _id: string };

const Widget = model('Widget', widgetSchema, 'widgets');

export default Widget;
