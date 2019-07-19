import React from "react";
import uuid from "uuid/v1";

import NoteList from "./NoteList";
import NewNote from "./NewNote";
import AppBar from "./AppBar";
import NoteService from "../servicos/NoteService";



class App  extends React.Component{
    state = {
             notes: [],
             isLoading: false   
         };
        
         
    componentDidMount(){
        this.handleReload();
    }         
    handleAddNote = text =>{
         this.setState(prevState => {
             const notes = prevState.notes.concat({ id: uuid(), text});
             this.handleSave(notes);
             return {notes}
        });
     }
 
    handleMove = (direction, index) => {
        this.setState(prevState => {
            // clona o array para nao perder o stado original
            const newNotes = prevState.notes.slice();
            // remove a nota do indice informado
            const removedNota = newNotes.splice(index, 1) [0];
            // colocar o item removidona posição nova
            // se o movimento for para cima colocamos a nota na posição anterior
            if(direction === "up"){
                newNotes.splice(index - 1, 0, removedNota);
            } else {
                newNotes.splice(index + 1, 0, removedNota);
            }

            this.handleSave(newNotes);


            // pegar o item da nota removida
            return{
                notes: newNotes
            };
        });
    };
 
    handleDelete = id => {
        this.setState(prevState => {
            // clona o array para nao perder o stado original
            const newNotes = prevState.notes.slice();
            const index = newNotes.findIndex(note => note.id === id);
            // remove a nota do indice informado
            newNotes.splice(index, 1);
            // colocar o item removidona posição nova
            // se o movimento for para cima colocamos a nota na posição anterior
            // pegar o item da nota removida
            this.handleSave(newNotes);
            return{
                notes: newNotes
            };
        });
    };
 
    handleEdit = (id, text) => {
         this.setState(prevState => {
           const newNotes = prevState.notes.slice();
           const index = newNotes.findIndex(note => note.id === id);
           newNotes[index].text = text;
           this.handleSave(newNotes);
           return {
             notes: newNotes
           };
         });
    };
       
    handleReload = () => {
        this.setState({isLoading: true });
        // em caso de sucesso o estado é alterado
        NoteService.load().then(notes => {
            this.setState({notes: JSON.parse(notes), isLoading:false });
        })
       

    }

    handleSave = notes => {
        this.setState({isLoading: true });  
        NoteService.save(notes).then(() => { 
            this.setState({isLoading: false });
        });  
    }
 
     render(){
         const {isLoading } = this.state;
         return (
             <div>
                <AppBar  
                    isLoading={isLoading}/>
                <div className="container">
                    <NewNote 
                        onAddNote={this.handleAddNote} />
                    <NoteList 
                        notes={this.state.notes} 
                        onMove={this.handleMove} 
                        onDelete={this.handleDelete}
                        onEdit={this.handleEdit}
                    />
                </div>
            </div>
         );
     }
 }
 
export default App;