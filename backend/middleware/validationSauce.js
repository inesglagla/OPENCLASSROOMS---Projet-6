//Ce middleware sert à vérifier la validité des champs d'une sauce que l'on crée
module.exports = (req, res, next) => {
  const sauce = JSON.parse(req.body.sauce);
  let {name, manufacturer, description, mainPepper} = sauce || {};
  let sauceTrim = [];

  function toTrim(...string) {
    sauceTrim = string.map((str) => str.trim());
  };

  toTrim(name, manufacturer, description, mainPepper);

  if (sauceTrim[0].length >= 3 && sauceTrim[1].length >= 3 && sauceTrim[2].length >= 3 && sauceTrim[3].length >= 3) {
    next()
  } else {
    return res.status(400).json({ message : 'Tous les champs nécessitent 3 caractères minimum!' });
  }
};