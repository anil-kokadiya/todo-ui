import { Component, OnInit } from '@angular/core';
import { Todo } from '../todo';
import { TodoService } from 'src/app/service/todo.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-todo-view',
  templateUrl: './todo-view.component.html',
  styleUrls: ['./todo-view.component.css'],
})
export class TodoViewComponent implements OnInit {
  todos: any = [];
  todo!: Todo;
  constructor(private todoService: TodoService, private router: Router) {}

  ngOnInit(): void {
    this.getTodoList();
    this.todoService.todoEmmiter.subscribe(() => {
      this.getTodoList();
    });
  }

  getTodoList() {
    this.todoService.getTodos().subscribe((data) => {
        this.todos = data;
    });
  }

  deleteTodo(id: number) {
    this.todoService
      .deleteTodoEntry(id)
      .subscribe((data) => this.getTodoList());
  }

  viewTodo(id: number) {
    this.router.navigateByUrl('/todo/', { state: [id] });
  }

  todoStatusChange(id: number) {
    for (var i = 0; i < this.todos.length; i++) {
      if (this.todos[i].id == id) {
        this.todo = this.todos[i];
      }
    }
    if (this.todo.checked == '0') {
      this.todo.checked = '1';
    } else {
      this.todo.checked = '0';
    }
    this.todoService.updateTodoEntry(this.todo).subscribe((data) => {
    });
  }

  updateTodo(id: number) {
    this.router.navigateByUrl('/todo/update/', { state: [id] });
  }
}
