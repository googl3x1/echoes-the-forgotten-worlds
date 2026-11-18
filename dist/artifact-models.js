import {createHeritageModel as createOriginalModel} from './heritage-models.js';
import {createCollectionModel,collectionModelSpecs} from './collection-models.js';
export function createHeritageModel(type,options={}){return collectionModelSpecs[type]?createCollectionModel(type,options):createOriginalModel(type,options);}
