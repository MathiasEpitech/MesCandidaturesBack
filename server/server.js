const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Candidature = require("./models/Candidature");
const Suivi = require("./models/Suivi");
const dotenv = require('dotenv'); // Importez le module dotenv

dotenv.config(); // Chargez les variables d'environnement à partir du fichier .env

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connexion à la base de données MongoDB en utilisant la variable d'environnement MONGODB_URI
mongoose.connect(
  process.env.MONGO_URL, // Utilisez la variable d'environnement pour l'URL de connexion
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;

db.on(
  "error",
  console.error.bind(console, "Erreur de connexion à la base de données :")
);
db.once("open", () => {
  console.log("Connecté à la base de données MongoDB");
});

app.get("/", async (req, res) => {
  try {
    // Récupérez toutes les candidatures depuis la base de données
    const candidatures = await Candidature.find();

    // Répondez avec les candidatures au format JSON
    res.json(candidatures);
  } catch (error) {
    console.error(error);
    // Répondez avec un code d'erreur en cas d'échec
    res.status(500).json({ message: "Erreur lors de la récupération des candidatures" });
  }
});


app.post("/api/candidatures", async (req, res) => {
  try {
    // Récupérez les données du formulaire depuis la requête
    const {
      nomEntreprise,
      coordonnees,
      provenanceAnnonce,
      technos,
      reponseEntretienRefus,
      lieu,
      intitulePoste,
      descriptionPoste,
      dateCandidature,
      dateRefus,
      dateRelance,
    } = req.body;

    // Créez une nouvelle instance du modèle Candidature avec les données du formulaire
    const nouvelleCandidature = new Candidature({
      nomEntreprise,
      coordonnees,
      provenanceAnnonce,
      technos,
      reponseEntretienRefus,
      lieu,
      intitulePoste,
      descriptionPoste,
      dateCandidature,
      dateRefus,
      dateRelance,
    });

    // Enregistrez la candidature dans la base de données
    await nouvelleCandidature.save();

    // Répondez avec un code de succès
    res.status(201).json({ message: "Candidature créée avec succès" });
  } catch (error) {
    console.error(error);
    // Répondez avec un code d'erreur en cas d'échec
    res
      .status(500)
      .json({ message: "Erreur lors de la création de la candidature" });
  }
});

app.get("/api/candidatures/:id", async (req, res) => {
  try {
    // Récupérez l'ID de la candidature à partir des paramètres de la requête
    const candidature = await Candidature.findById(req.params.id);

    // Vérifiez si la candidature existe
    if (!candidature) {
      return res.status(404).json({ message: "Candidature non trouvée" });
    }

    // Répondez avec la candidature au format JSON
    res.json(candidature);
    console.log(candidature);
  } catch (error) {
    console.error(error);
    // Répondez avec un code d'erreur en cas d'échec
    res.status(500).json({ message: "Erreur lors de la récupération de la candidature" });
  }
});

// Route pour mettre à jour une candidature par son ID
app.put("/api/candidatures/modifier/:id", async (req, res) => {
  try {
    const candidature = await Candidature.findByIdAndUpdate(
      req.params.id,
      req.body, // Les données de mise à jour se trouvent dans le corps de la requête
      { new: true } // Cela renverra la candidature mise à jour
    );

    if (!candidature) {
      return res.status(404).json({ message: "Candidature non trouvée" });
    }

    res.json(candidature);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la mise à jour de la candidature" });
  }
});

// Route pour supprimer une candidature par son ID
app.delete("/api/candidatures/supprimer/:id", async (req, res) => {
  try {
    const candidature = await Candidature.findByIdAndRemove(req.params.id);

    if (!candidature) {
      return res.status(404).json({ message: "Candidature non trouvée" });
    }

    res.json({ message: "Candidature supprimée avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la suppression de la candidature" });
  }
});

app.get("/api/suivi", async (req, res) => {
  try {
    // Récupérez toutes les candidatures depuis la base de données
    const suivi = await Suivi.find();

    // Répondez avec les candidatures au format JSON
    res.json(suivi);
  } catch (error) {
    console.error(error);
    // Répondez avec un code d'erreur en cas d'échec
    res.status(500).json({ message: "Erreur lors de la récupération des suivis" });
  }
});

app.post("/api/suivi-create", async (req, res) => {
  try {
    // Récupérez les données du formulaire depuis la requête
    const {
      dateSuivi,
    } = req.body;
    // console.log(req.body);

    // Créez une nouvelle instance du modèle Candidature avec les données du formulaire
    const nouveauSuivi = new Suivi({
      dateSuivi,
    });
    // console.log(nouveauSuivi);

    // Enregistrez la candidature dans la base de données
    await nouveauSuivi.save();

    // Répondez avec un code de succès
    res.status(201).json({ message: "Suivi créée avec succès" });
  } catch (error) {
    console.error(error);
    // Répondez avec un code d'erreur en cas d'échec
    res
      .status(500)
      .json({ message: "Erreur lors de la création du suivi" });
  }
});


// Lancer le serveur
app.listen(port, () => {
  console.log(`Le serveur est en cours d'exécution sur le port ${port}`);
});
