class FSM {
  /**
   * Creates new FSM instance.
   * @param config
   */
  constructor(config) {
    if (!config) {
      throw new Error();
    }
    this._config = config;
    this._currentState = config.initial;

    this._undo = [config.initial];
    this._redo = [];
  }

  /**
   * Returns active state.
   * @returns {String}
   */
  getState() {
    return this._currentState;
  }

  /**
   * Goes to specified state.
   * @param state
   */
  changeState(state) {
    if (!this._config.states[state]) {
      throw new Error();
    }
    this._undo.push(state);
    this._currentState = state;
  }

  /**
   * Changes state according to event transition rules.
   * @param event
   */
  trigger(event) {
    if (!this._config.states[this._currentState].transitions[event]) {
      throw new Error();
    }
    this.changeState(
      this._config.states[this._currentState].transitions[event],
    );
  }

  /**
   * Resets FSM state to initial.
   */
  reset() {
    this._currentState = this._config.initial;
  }

  /**
   * Returns an array of states for which there are specified event transition rules.
   * Returns all states if argument is undefined.
   * @param event
   * @returns {Array}
   */
  getStates(event) {
    if (event) {
      return Object.keys(this._config.states).filter(
        item => this._config.states[item].transitions[event] !== undefined,
      );
    }
    return Object.keys(this._config.states);
  }

  /**
   * Goes back to previous state.
   * Returns false if undo is not available.
   * @returns {Boolean}
   */
  undo() {
    if (this._currentState === this._config.initial) {
      return false;
    }
    if (this._undo.length === 0) {
      return false;
    }
    const redo = this._undo.pop();
    const state = this._undo[this._undo.length - 1];
    this._currentState = state;
    if (this._redo[this._redo.length - 1] !== redo) {
      this._redo.push(redo);
    }
    return true;
  }

  /**
   * Goes redo to state.
   * Returns false if redo is not available.
   * @returns {Boolean}
   */
  redo() {
    if (this._redo.length === 0) {
      return false;
    }
    const undo = this._redo.pop();
    const state =
      this._redo.length === 0 ? undo : this._redo[this._redo.length - 1];
    this._currentState = state;
    if (this._undo[this._undo.length - 1] !== undo) {
      this._undo.push(undo);
    }
    return true;
  }

  /**
   * Clears transition history
   */
  clearHistory() {
    this._undo = [];
    this._redo = [];
  }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
