class QuestionnaireSession
{
  tree = null;
  choices = {}

  constructor(tree) {
    this.tree = tree;
  }

  addChoice(option) {
    this.choices[option.getId()] = option;

    console.log(this);

    return option;
  }
}

