import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { TodoService } from 'src/app/service/todo.service';
import { Todo } from '../todo';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-todo-add',
  templateUrl: './todo-add.component.html',
  styleUrls: ['./todo-add.component.css'],
})
export class TodoAddComponent extends NgbDateParserFormatter implements OnInit {
  todoForm!: FormGroup
  submitted: boolean = false;
  d = new Date();
  minDateObj = {'year': this.d.getFullYear(), 'month': this.d.getMonth() + 1, 'day': this.d.getDate()};
  readonly DELIMITER = '/';
  parse(value: string): NgbDateStruct {
    let result: NgbDateStruct = {
      day: 1,
      month: 11,
      year: 2021,
    };
    if (value) {
      let date = value.split(this.DELIMITER);
      if (date.length == 3 && date[2].length == 4) {
        result = {
          day: parseInt(date[0], 10),
          month: parseInt(date[1], 10),
          year: parseInt(date[2], 10),
        };
      }
    }
    return result;
  }

  format(date: NgbDateStruct): string {
    let result: string = '';
    if (date) {
      result =
        date.day + this.DELIMITER + date.month + this.DELIMITER + date.year;
    }
    return result;
  }

  isshowTodoForm: boolean = false;
  fields = {};
  records = {};
  @Output() todoViewEmitter: EventEmitter<Todo> = new EventEmitter();
  todo: any = {
    name: '',
    description: '',
    due: '',
    checked: '0',
  };
  constructor(private todoService: TodoService, private formBuilder: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.todoForm = this.formBuilder.group({
      todoName: ['', [Validators.required, Validators.minLength(3)]],
      todoDesc: ['', [Validators.required, Validators.minLength(3)]],
      todoDue: ['', Validators.required],
    });
  }

  showTodoForm() {
    if (this.isshowTodoForm) {
      this.isshowTodoForm = false;
    } else {
      this.isshowTodoForm = true;
    }
  }

  addNewTodo() {
    this.submitted = true;
    if(this.todoForm.invalid){
      return;
    }
    this.todo.due = this.todoService.converDateObjectToString(
      this.todo.due,
      'DDMMYYYY',
      '/'
    );
    this.createTodo();
  }

  hideTodoForm() {
    this.isshowTodoForm = false;
    this.clearTodoForm();
  }

  createTodo() {
    this.todoService.addTodoEntry(this.todo).subscribe((data) => {
      this.todoService.todoEmmiter.emit(this.todo);
      this.clearTodoForm();
    });
  }

  clearTodoForm() {
    this.submitted = false;
    this.todo = {
      name: '',
      description: '',
      due: '',
      checked: '0',
    };
    this.isshowTodoForm = false;
  }
}
