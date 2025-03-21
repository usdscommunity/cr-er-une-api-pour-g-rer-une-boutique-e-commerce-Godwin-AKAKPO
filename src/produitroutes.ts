import express from 'express';
import {Request, Response} from 'express';
import {Produit} from './modeles/Produit';
import {sql_db_pool_promise} from "./mysql";

//const appExpress = express();
const produitRouter = express.Router();

//Ajouter un produit
produitRouter.post("", async(req : Request, res :Response)  =>{
    const produit = req.body as Produit;

    if (!produit.nom || !produit.description || !produit.prix_hors_taxe || !produit.prix_ttc || !produit.category_id ){
        res.status(400).json({message:"Tous les champs sont requis"});
        return;
    }
    try {
        //Au niveau de cette requete sql j'utilise la jointure pour gérer l'affichage du nom de la catégorie au lieu d'afficher la categorie_id, ainsi la requete récupère la catégorie_id de chaque enregistrement et va mtn dans la table catégorie pour récupérer le nom de la catégorie correspondante 
        const sqlRequest : string = "INSERT INTO produit(nom, description, prix_hors_taxe, prix_ttc, category_id) values(?, ?, ?, ?, ?)";
        const [result] = await sql_db_pool_promise.execute(
            sqlRequest,
            [produit.nom, produit.description, produit.prix_hors_taxe, produit.prix_ttc, produit.category_id]
        )
        res.status(201).json({message: "Produit crée avec succès !", produit: produit, result:result});
    } catch (err) {
        console.error(err)
        res.status(500).json({message: "Echec lors de la creation du produit"})
    }

});

//RETRIEVE : Récupérer tous les produits

produitRouter.get("", async(req : Request, res :Response)  =>{
    try {
        const sqlRequest : string = "SELECT DISTINCT p.id, p.nom, p.description, p.prix_hors_taxe, p.prix_ttc, c.nom AS categorie FROM produit p INNER JOIN category c ON p.category_id = c.id ";
        const [result] = await sql_db_pool_promise.execute(sqlRequest);
        res.status(200).json(result);
    } catch (err) {
        console.error(err)
        res.status(500).json({message: "Echec lors de la récupération des produits "})
    }
});

//RETRIEVE : Récupérer un produit par son ID 
produitRouter.get("/:id", async(req : Request, res :Response)  =>{
    const id = req.params['id'];

    try {
        const sqlRequest : string = "SELECT * FROM produit WHERE id = ?";
        const [result] = await sql_db_pool_promise.execute(sqlRequest, [id])as any[];
        if (result['length'] == 0){
            res.status(404).json({message : "Produit non retrouvé "})
        }
        res.status(200).json(result);

    } catch (err) {
        console.error(err)
        res.status(500).json({message: "Echec lors de la récupération du Produit "})
    }
});

//Mettre à jour une produit
produitRouter.put("/:id", async(req : Request, res :Response)  =>{
    const id = req.params['id'];
    const produit = req.body as Produit;

    if (!produit.nom || !produit.description || !produit.description || !produit.prix_hors_taxe || !produit.prix_ttc || !produit.category_id ){
        res.status(400).json({message:"Tous les champs sont requis"});
        return;
    }
    try {
        const sqlRequest : string = "UPDATE produit SET nom = ?, description = ?,  prix_hors_taxe = ?, prix_ttc = ?, category_id = ? WHERE id = ?";
        const [result] = await sql_db_pool_promise.execute(
            sqlRequest,
            [produit.nom, produit.description, produit.prix_hors_taxe, produit.prix_ttc, produit.category_id, id]
        )as any[];
        if (result['affectedRows'] == 0){
            res.status(404).json({message : "Produit non retrouvé "})
        } 
        res.status(201).json({message: "Produit mis à jour avec succès !", produit: produit, result:result});
    } catch (err) {
        console.error(err)
        res.status(500).json({message: "Echec lors de la mis à jour de la categorie"})
    }
});

//Supprimer une produit 
produitRouter.delete("/:id", async(req : Request, res :Response)  =>{
    const id = req.params['id'];
    const produit = req.body as Produit;
    try {
        const sqlRequest : string = "DELETE FROM produit WHERE id = ?";
        const [result] = await sql_db_pool_promise.execute(
            sqlRequest,
            [id]
        )as any[];
        if (result['affectedRows'] == 0){
            res.status(404).json({message : "Produit non retrouvé "})
        } 
        res.status(201).json({message: "Produit supprimé avec succès !", Produit: produit, result:result});
    } catch (err) {
        console.error(err)
        res.status(500).json({message: "Echec lors de la suppression de la categorie "})
    }
});

export const apiProduitRouter = produitRouter