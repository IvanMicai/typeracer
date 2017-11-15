class Room {
  constructor({
    name = '',
    active_users = 0,
    keystrokes = 0,
    active_since = 0,
    counter = 0,
    below_mean = 0,
    ranking = [],
    last_minute_lead = '',
    users_history = [],
    text = this.generateText(),
    status = 'waiting',
    users_status = [],
    score_board = {},
    created_at = (new Date()).getTime(),
    started_at = 0,
  } = {}) {
    this.name = name;
    this.active_users = active_users;
    this.keystrokes = keystrokes;
    this.active_since = active_since;
    this.counter = counter;
    this.below_mean = below_mean;
    this.ranking = ranking;
    this.last_minute_lead = last_minute_lead;
    this.users_history = users_history;
    this.status = status;
    this.users_status = users_status;
    this.text = text;
    this.score_board = score_board;
    this.created_at = created_at;
    this.started_at = started_at;
  }

  generateText() {
    const textList = [
      'Remember that humor is written backwards. That means you first find the cliche you want to work on, then build a story around it.',
      'The Earth is a world, the world is a ball, a ball in a game with no rules at all. And just as I wonder at the beauty of it all, you go and drop it and it breaks and falls.',
      "When I was your age, television was called books. And this is a special book. It was the book my father used to read to me when I was sick, and I used to read it to your father. And today I'm gonna read it to you.",
      'In the casino, the cardinal rule is to keep them playing and to keep them coming back. The longer they play, the more they lose, and in the end, we get it all. Running a casino is like robbing a bank with no cops around.',
      'Good games offer players a set of challenging problems and then let them practice these until they have routinized their mastery.',
      "Ever since I was a child, folks have thought they had me pegged, because of the way I am, the way I talk. And they're always wrong.",
      'Ticking away the moments that make up a dull day, you fritter and waste the hours in an off-hand way. Kicking around on a piece of ground in your home town, waiting for someone or something to show you the way.',
      "You've got a way to keep me on your side. You give me cause for love that I can't hide. For you I know I'd even try to turn the tide. Because you're mine, I walk the line.",
      'The example of painting can teach us not only how to manage our own work, but how to work together. A lot of the great art of the past is the work of multiple hands, though there may only be one name on the wall next to it in the museum.',
      "All time is all time. It does not change. It does not lend itself to warnings or explanations. It simply is. Take it moment by moment, and you will find that we are all, as I've said before, bugs in amber",
    ];

    return textList[Math.floor((Math.random() * 10))];
  }

  users() {
    return this.ranking.map(rank => rank[0]);
  }

  userExists(username) {
    const user = this.ranking.find(rankingUser => rankingUser[0] === username);

    if (user) {
      return user[0];
    }

    return undefined;
  }

  userReady(username) {
    if (!this.userExists(username)) {
      return false;
    }

    this.score_board[username].status = 'ready';

    return true;
  }

  userInputs(username) {
    if (!this.userExists(username)) {
      return undefined;
    }

    const userInputs = this.users_history.filter(input => input.username === username);

    if (!userInputs) {
      return [];
    }

    return userInputs;
  }

  userLastInput(username) {
    const userInputs = this.userInputs(username);
    return userInputs[userInputs.length - 1];
  }

  userJoin(username) {
    if (!this.userExists(username)) {
      this.ranking.push([username, 0]);
      this.score_board[username] = {
        score: 0,
        correctCursor: -1,
        status: 'waiting',
      };

      this.active_users = Object.keys(this.score_board).length;
    }
  }
}

exports.Room = Room;