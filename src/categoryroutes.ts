import express from 'express';
import {Request, Response} from 'express';
import {Category} from './modeles/Category';
import {sql_db_pool_promise} from "./mysql";

//const appExpress = express();
const categoryRouter = express.Router();

//Ajouter une catégorie
categoryRouter.post("", async(req : Request, res :Response)  =>{
    const category = req.body as Category;

    if (!category.nom || !category.description){
        res.status(400).json({message:"Le nom et la description sont requis"});
        return;
    }
    try {
        const sqlRequest : string = "INSERT INTO category(nom, description) values(?,?)";
        const [result] = await sql_db_pool_promise.execute(
            sqlRequest,
            [category.nom, category.description]
        )
        res.status(201).json({message: "Categorie crée avec succès !", category: category, result:result});
    } catch (err) {
        console.error(err)
        res.status(500).json({message: "Echec lors de la creation de la categorie"})
    }

});

//RETRIEVE : Récupérer tous les catégories

categoryRouter.get("", async(req : Request, res :Response)  =>{
    try {
        const sqlRequest : string = "SELECT * FROM category";
        const [result] = await sql_db_pool_promise.execute(sqlRequest);
        res.status(201).json(result);
    } catch (err) {
        console.error(err)
        res.status(500).json({message: "Echec lors de la récupération des catégories "})
    }
});

//RETRIEVE : Récupérer une catégorie par son ID 
categoryRouter.get("/:id", async(req : Request, res :Response)  =>{
    const id = req.params['id'];

    try {
        const sqlRequest : string = "SELECT * FROM `category` WHERE id = ?";
        const [result] = await sql_db_pool_promise.execute(sqlRequest, [id])as any[];
        if (result['length'] == 0){
            res.status(404).json({message : "Categorie non retrouvé "})
        }
        res.status(200).json(result);
        
    } catch (err) {
        console.error(err)
        res.status(500).json({message: "Echec lors de la récupération de la catégorie "})
    }
});

//Mettre à jour une catégorie
categoryRouter.put("/:id", async(req : Request, res :Response)  =>{
    const id = req.params['id'];
    const category = req.body as Category;

    if (!category.nom || !category.description){
        res.status(400).json({message:"Le nom et la description sont requis"});
        return;
    }
    try {
        const sqlRequest : string = "UPDATE category SET nom = ?, description = ? WHERE id = ?";
        const [result] = await sql_db_pool_promise.execute(
            sqlRequest,
            [category.nom, category.description, id]
        )as any[];
       if (result['affectedRows'] == 0){
            res.status(404).json({message : "Categorie non retrouvé "})
        }
        res.status(201).json({message: "Categorie mis à jour avec succès !", category: category, result:result});
    } catch (err) {
        console.error(err)
        res.status(500).json({message: "Echec lors de la mis à jour de la categorie"})
    }
});

//Supprimer une catégorie 
categoryRouter.delete("/:id", async(req : Request, res :Response)  =>{
    const id = req.params['id'];
    const category = req.body as Category;
    try {
        const sqlRequest : string = "DELETE FROM category WHERE id = ?";
        const [result] = await sql_db_pool_promise.execute(
            sqlRequest,
            [id]
        )as any[];
        if (result['affectedRows'] == 0){
            res.status(404).json({message : "Categorie non retrouvé "})
        }
        res.status(201).json({message: "Categorie supprimé avec succès !", category: category, result:result});
    } catch (err) {
        console.error(err)
        res.status(500).json({message: "Echec lors de la suppression de la categorie "})
    }
});

export const apiCategoryRouter = categoryRouter 