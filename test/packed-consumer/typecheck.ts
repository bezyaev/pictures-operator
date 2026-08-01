import {
  PictureFormat,
  PicturesOperator,
  PictureOperatorStatus,
  type PictureOperatorConfig
} from 'pictures-operator';

const config: PictureOperatorConfig = {
  format: PictureFormat.avif,
  quality: 80,
  resize: [8, 6]
};
const operator = new PicturesOperator();
const status: PictureOperatorStatus = operator.getStatus();

void config;
void status;
