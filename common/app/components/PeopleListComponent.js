import { html } from 'lit-element';
import { PeoplesService } from '../sevices/People.js';
import { PageViewElement } from './PageViewElement.js';

import './PeopleCardComponent';

export class PeopleList extends PageViewElement {
  static get properties() {
    return {
      peopleid: String
    };
  }

  constructor() {
    super();
    this.peoplesService = new PeoplesService();
    this.peoples = [];
    this.peopleid = undefined;
    this.filteredPeople = [];
    this.loading = true;
    this.query = '';
  }

  async getPeoples() {
    this.loading = true;
    this.peoples = await this.peoplesService.getPeoples();
    this.filterPeopleById(this.peopleid);
    this.loading = false;
  }

  filterPeopleById(id) {
    const people = this.peoples.find(people => id === '' + people.id);
    this.filteredPeople = people ? [people] : this.peoples;
  }

  filterPeopleByName(str) {
    const query = str.toLowerCase();
    this.filteredPeople = this.peoples.filter(people => {
      const name = `${people.firstname} ${people.lastname}`.toLowerCase();
      return name.includes(query);
    });
  }

  keyUpPeople(e) {
    const query = e.srcElement.value;
    if (query.length > 2) {
      this.filterPeopleByName(query);
    } else {
      this.filteredPeople = this.peoples;
    }
    this.requestUpdate();
  }

  render() {
    return html`
      <link rel="stylesheet" href="/mdl/material.min.css" crossorigin="anonymous" />
      <link rel="stylesheet" href="/css/app.css" crossorigin="anonymous" />
      <link rel="stylesheet" href="/css/md-overwrite.css" crossorigin="anonymous" />

      <div>
        ${this.filteredPeople.length < 1
          ? html`
              <div class="people-list-all md-padding" layout="row" layout-wrap layout-align="center center">
                <div>
                  <div>
                    <h1>No people found</h1>
                  </div>
                </div>
              </div>
            `
          : html`
              <div class="people-list-all md-padding" layout="row" layout-wrap layout-align="center center">
                ${!this.peopleid
                  ? html`
                      <form>
                        <div class="mdl-textfield mdl-js-textfield mdl-textfield--expandable">
                          <label class="mdl-button mdl-js-button mdl-button--icon" for="pleople-search">
                            <i class="material-icons">search</i>
                          </label>
                          <div class="mdl-textfield__expandable-holder">
                            <input
                              class="mdl-textfield__input"
                              type="text"
                              id="pleople-search"
                              @keyup="${this.keyUpPeople}"
                            />
                            <label class="mdl-textfield__label" for="sample-expandable">Expandable Input</label>
                          </div>
                        </div>
                      </form>
                    `
                  : html``}
                <div class="people-card-list" data-people-cards-wrapper>
                  ${this.filteredPeople.map(
                    people => html`
                      <people-card class="people-card-list-mode" people="${JSON.stringify(people)}"></people-card>
                    `
                  )}
                </div>
              </div>
            `}
      </div>
    `;
  }

  async performUpdate() {
    await this.getPeoples();
    super.performUpdate();
  }
}
customElements.define('people-list', PeopleList);
