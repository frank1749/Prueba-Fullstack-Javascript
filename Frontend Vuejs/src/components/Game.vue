<template>

  <div class="container">
      <div class="text-primary text-center">
        <h2>Juego 3 en línea Frank M.</h2>
      </div>

      <div class="row">

        <div class="col-md-6">

           <input v-model="name_game" id="inputName" type="text" placeholder="Nombre partida">
           <button type="submit" @click="save_g(2)" class="btn btn-primary mb-2">
              Guardar partida
           </button>

           <a href="#" @click="isOpen = !isOpen">Listado de juegos</a>

          <div v-show="isOpen">
            <div v-if="all_records.length > 0">

              <a href="#" class="text-danger" @click="deleteGames($event)">Eliminar todas las partidas</a>

              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">Nombre</th>
                    <th scope="col">Fecha</th>
                    <th scope="col">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in all_records" v-bind:key="index">
                    <td>{{item.name}}</td>
                    <td>{{item.date_time}}</td>
                    <td>
                      <span v-if="item.state == 0" class="text-warning">Empatado</span>
                      <span v-if="item.state == 1" class="text-success">Terminado</span>
                      <span v-if="item.state == 2" class="text-danger">Pausado</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else>
              <p class="text-center">No tiene partidas guardadas</p>
            </div>
          </div>

        </div>

        <div class="col-md-6">

            <div class="form-group row">
              <label class="col-md-4 col-form-label">Partidas guardadas</label>
              <div class="col-md-8">
                <select class="form-control" @change="select_reg" v-model="item_select">
                  <option value="">Seleccione partidas pausadas...</option>
                  <option 
                    v-for="(item, index) in saved_records" 
                    v-bind:key="index"
                    :id="'item_var'+item.id" 
                    :data-field="item.fields"
                    :data-name="item.name" 
                    :value="item.id"
                  >
                    {{ item.name }}
                  </option>
                </select>
              </div>
            </div>

        </div>
        
      </div>

      <div class="game">
        <board :squares="squares" :winner="winner" @click="click" />
      </div>

      <div class="game-info">
        <p v-if="stepNumber === 0">
          Vamos a comenzar! primero la&nbsp;<b :class="currentPlayer">{{ currentPlayer }}</b>!
        </p>
        <p v-else-if="!!winner">
          <strong>El ganador es:&nbsp;</strong>
          <b :class="currentPlayer">{{ currentPlayer }}</b>!&nbsp;
          <button @click="restart">Jugar nuevamente</button>
        </p>
        <p v-else-if="stepNumber > 8">
          <strong>Juego empatado!&nbsp;</strong>
          <button @click="restart">Jugar nuevamente</button>
        </p>
        <p v-else>
          Ahora es el turno del jugador&nbsp;
          <b :class="currentPlayer">{{ currentPlayer }}</b>!&nbsp; a jugar.
        </p>
        <button v-show="winner == null" @click="restart">Reiniciar juego</button>
      </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: 'Game',
  components: {
    Board: () => import('./Board')
  },
  data () {
    return {
      won_games: 'http://localhost:5000/won-games',
      all_games: 'http://localhost:5000/all-games',
      create_game: 'http://localhost:5000/insert-game',
      update_game: 'http://localhost:5000/update-game',
      delete_game: 'http://localhost:5000/delete-game',
      isOpen: false,
      saved_records: [],
      all_records: [],
      item_select: '',
      squares: Array(9).fill(null),
      stepNumber: 0,
      currentPlayer: 'X',
      winner: null,
      name_game: '',
      game_name_old: ''
    }
  },
  mounted () { 
    this.getWonGames();
    this.getAllGames();
  },
  methods: {
    getWonGames(){
      axios.get(this.won_games).then((result) => {
        this.saved_records = result.data.data;
      }).catch(error => {
          alert("No esta disponible el servidor.");
          console.log(error);
      });
    },

    getAllGames(){
      axios.get(this.all_games).then((result) => {
        //console.log('all games ',result);
        this.all_records = result.data.data;
      }).catch(error => {
          alert("No esta disponible el servidor.");
          console.log(error);
      });
    },

    deleteGames(){
      var conf = confirm("Desea eliminar todas las partidas guardadas?");
      if(conf){
        axios.post(this.delete_game).then((result) => {
          if (result.data.success === true) {
            alert("PARTIDA ELIMINADAS EXITOSAMENTE!!");
            this.restart();
            this.getWonGames();
            this.getAllGames();
          }else{
            alert("ERROR DEL SERVICIO");
          }
        }).catch(error => {
            alert("No esta disponible el servidor.");
            console.log(error);
        });
      }
    },

    hasWinner() {
      if (this.winner) return true

      const squares = this.squares
      const matches = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7],
        [2, 5, 8], [0, 4, 8], [2, 4, 6]
      ]

      for (let i = 0; i < matches.length; i++) {
        const [a, b, c] = matches[i]
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
          this.winner = [ a, b, c ]
          return true
        }
      }

      return false
    },

    restart() {
      this.squares = Array(9).fill(null)
      this.stepNumber = 0
      this.currentPlayer = this.currentPlayer
      this.winner = null
      this.item_select = ''
      this.name_game = ''
      document.getElementById("inputName").focus();
    },

    click (i) {

      if (this.name_game == '') {
        alert("Por favor antes digite nombre de la partida");
        document.getElementById("inputName").focus();
        return false;
      }

      if (this.squares[i] || this.winner) return
      this.$set(this.squares, i, this.currentPlayer)

      if(this.hasWinner() === true){
        //Actualizo una partida almacenada
        if (this.item_select !== '') {
          this.update_g();
        }else{
          this.save_g(1);
        }
      }

      if (!this.hasWinner()) {

        this.stepNumber++
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X'

        if (this.stepNumber > 8) {
          //Guardo la partida en estado 0 la cual es equivalente a empate.
          this.save_g(0);
        }
        
      }
    },

    save_g(state_value) {
      //console.log(this.squares.every(element => element === null));

      if(this.game_name_old == this.name_game){
        alert("Ya existe una partida con ese mismo nombre!! Por favor cambie el nombre.");
        document.getElementById("inputName").focus();
        return false;
      }

      if (this.squares.every(element => element === null) === true) {
        alert("No hay nada nuevo que guardar.");
      }else{

        if (this.name_game == '') {
          alert("Por favor digite el nombre de la partida a guardar.");
          document.getElementById("inputName").focus();
          return false;
        }

        var arr_conf = JSON.stringify(this.squares);

        let post = {
          name: this.name_game,
          fields: arr_conf,
          state: state_value
        };
        axios.post(this.create_game, post).then((result) => {
          console.log(result);
          if (result.data.data.success === true) {
            alert("PARTIDA GUARDADA FELICITACIONES!!");
            this.restart();
            this.getWonGames();
            this.getAllGames();
          }else{
            alert("ERROR DEL SERVICIO");
          }
        }).catch(error => {
          alert("No esta disponible el servidor.");
          console.log(error);
        });

      }

    },

    update_g() {

      var arr_conf = JSON.stringify(this.squares);

      let post = {
        name: this.name_game,
        fields: arr_conf,
        state: 1,
        id: this.item_select
      };
      axios.put(this.update_game, post).then((result) => {
        //console.log(result);
        if (result.data.success === true) {
          alert("PARTIDA ACTUALIZADA Y TERMINADA FELICITACIONES!!");
          this.restart();
          this.getWonGames();
          this.getAllGames();
        }else{
          alert("ERROR DEL SERVICIO");
        }
      }).catch(error => {
        alert("No esta disponible el servidor.");
        console.log(error);
      });

    },

    select_reg() {

      //alert(this.item_select);
      if (this.item_select !== '') {
        var obj_var = document.getElementById("item_var"+this.item_select).getAttribute("data-field");
        this.squares = JSON.parse(obj_var);
        this.name_game = document.getElementById("item_var"+this.item_select).getAttribute("data-name");
        this.game_name_old = document.getElementById("item_var"+this.item_select).getAttribute("data-name");
      }else{
        this.restart();
      }

    }

  }
}
</script>

<style scoped>
.game {
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.game-info {
  margin: 3vmin 0 0;
  padding: 1rem .5rem;
  font-size: 1.25em;
  text-align: center;
  box-shadow: 2.5px 5px 25px #0001, 0 1px 6px #0004;
  text-shadow: 0 0 1px #fff, 0 2px 5px #fff5;
  border-radius: .5rem;
  backdrop-filter: blur(10px);
  background: #fff6;
  background-blend-mode: exclusion;
  background-image: var(--noise-pattern);
  color: #111;
}

.game-info p {
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.game-info .X,
.game-info .O {
  text-shadow: -1px -1px 0 #000b, -1px 1px 0 #000b, 1px -1px 0 #000b, 1px 1px 0 #000b;
}

.game-info .X {
  color: #ff5722;
}

.game-info .O {
  color: #ffeb3b;
}

.game-info button {
  text-transform: uppercase;
  font-weight: 600;
  font-size: .75em;
  padding: .5rem 1rem;
  margin: -.5rem 0 -.5rem 1rem;
  border: 2px solid #fff;
  background: #fff5;
  text-shadow: 0 0 1px #fff, 0 2px 5px #fff5;
  color: #111;
  cursor: pointer;
  outline: none;
  transition: all .25s ease;
}

.game-info button:focus,
.game-info button:hover {
  background: #1115;
  border-color: rgba(var(--theme-color));
  box-shadow: 0 0 10px rgba(var(--theme-color), .75);
  color: rgba(var(--theme-color));
  text-shadow: -1px -1px 0 #0007, -1px 1px 0 #0007, 1px -1px 0 #0007, 1px 1px 0 #0007;
}

.game-info button:active {
  background: #1119;
}
</style>