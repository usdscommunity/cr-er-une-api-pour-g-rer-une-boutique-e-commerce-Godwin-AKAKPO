import express from 'express';
import {Request, Response} from 'express';
import {sql_db_pool_promise} from "../database/mysql";

const searchesproduitRouter = express.Router();

searchesproduitRouter.get('/:category_id', async(req:Request, res: Response) =>{
    //Je définis  la variable qui va stocker la catégorie passé dans l'url 
    const category_id = req.params['category_id'];
    try {
        //Récupérons les produits qui ont pour catégorie la catégorie passé dans l'url de la route 
        const sqlRequest = "SELECT * FROM produit WHERE category_id =  ?"
        const [result] = await sql_db_pool_promise.execute(sqlRequest, [category_id])as any[];
        if (result['length'] === 0){
            res.status(404).json({message : "Aucun produit trouvé pour cette catégorie "})
        }
        res.status(200).json(result);
    } catch (err) {
        console.error(err)
        res.status(500).json({message: "Echec lors de la récupération des Produits liées à cette catggorie"})
    } 
})
export const apisearchesproduitRouter = searchesproduitRouter
 