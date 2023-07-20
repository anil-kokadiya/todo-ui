import { Component, OnInit } from '@angular/core';
import { TodoService } from 'src/app/service/todo.service';

@Component({
  selector: 'app-todo-single',
  templateUrl: './todo-single.component.html',
  styleUrls: ['./todo-single.component.css'],
})
export class TodoSingleComponent implements OnInit {
  toDoId: number = 0;
  todo: any = [];
  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.toDoId = history.state[0];
    this.getSingleTodo();
  }

  getSingleTodo() {
    this.todoService.getSingleTodo(this.toDoId).subscribe((data) => {
      this.todo = data;
    });
  }
}
