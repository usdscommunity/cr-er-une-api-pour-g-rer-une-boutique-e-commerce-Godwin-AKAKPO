import express from 'express';
import {Request, Response} from 'express';
import {sql_db_pool_promise} from "./mysql";

const searchesproduitRouter = express.Router();

searchesproduitRouter.get('/:category', async(req:Request, res: Response) =>{
    //Je définis  la variable qui va stocker la catégorie passé dans l'url 
    const category = req.params['category'];
    try {
        //Récupérons les produits qui ont pour catégorie la catégorie passé dans l'url de la route 
        const sqlRequest = "SELECT p.id, p.nom, p.description, p.prix_hors_taxe, p.prix_ttc, c.nom AS categorie FROM produit p JOIN category c ON p.category_id = c.id WHERE c.nom = ?"
        const [result] = await sql_db_pool_promise.execute(sqlRequest, [category])as any[];
        if (result['length'] == 0){
            res.status(404).json({message : "Aucun produit trouvé pour cette catégorie "})
        }
        res.status(200).json(result);

    } catch (err) {
        console.error(err)
        res.status(500).json({message: "Echec lors de la récupération des Produits "})
    }
    
})
export const apisearchesproduitRouter = searchesproduitRouter
