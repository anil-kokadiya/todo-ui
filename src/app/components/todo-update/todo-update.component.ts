import { Component, OnInit } from '@angular/core';
import { TodoService } from 'src/app/service/todo.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-todo-update',
  templateUrl: './todo-update.component.html',
  styleUrls: ['./todo-update.component.css'],
})
export class TodoUpdateComponent implements OnInit {
  todoForm!: FormGroup
  submitted: boolean = false;
  toDoId: number = 0;
  todo: any = [];
  d = new Date();
  minDateObj = {'year': this.d.getFullYear(), 'month': this.d.getMonth() + 1, 'day': this.d.getDate()};

  constructor(private todoService: TodoService, private router: Router, private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.todoForm = this.formBuilder.group({
      todoName: ['', [Validators.required, Validators.minLength(3)]],
      todoDesc: ['', [Validators.required, Validators.minLength(3)]],
      todoDue: ['', Validators.required],
    });
    this.toDoId = history.state[0];
    this.getTodoData();
  }

  getTodoData() {
    this.todoService.getSingleTodo(this.toDoId).subscribe((data) => {
      this.todo = data;
      this.todo.due = this.todoService.convertStringToDateObject(this.todo.due);
    });
  }

  todoUpdate() {
    this.submitted = true;
    if(this.todoForm.invalid){
      return;
    }
    this.todo.due = this.todoService.converDateObjectToString(
      this.todo.due,
      'DDMMYYYY',
      '-'
    );
    this.todoService.updateTodoEntry(this.todo).subscribe((data) => {
      this.router.navigateByUrl("/");
    });
  }
}
