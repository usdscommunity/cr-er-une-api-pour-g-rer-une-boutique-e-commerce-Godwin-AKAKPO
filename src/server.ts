import express from 'express';
import {apiCategoryRouter} from "./Controllers/categoryroutes";
import {apiProduitRouter} from "./Controllers/produitroutes";
import {apisearchesproduitRouter} from "./Controllers/searchesproduitroutes"
const appExpress = express();

appExpress.use(express.json());

//Mon CRUD por les catégories
appExpress.use('/Category', apiCategoryRouter)
//Mon CRUD pour les produits
appExpress.use('/Produit', apiProduitRouter)
//Ma fonctionnalité d'afficahge des produits selo une actégorie donné 
appExpress.use('/searchesProduit', apisearchesproduitRouter)

//Faisons démarrer le serveur 
appExpress.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});