import { Injectable, EventEmitter, Output } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Todo } from '../components/todo';
import * as moment from 'moment/moment';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  @Output() todoEmmiter: EventEmitter<any> = new EventEmitter();

  private toDoUrl = environment.todoUrl;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
  };

  constructor(private httpClient: HttpClient) {}

  getTodos() {
    return this.httpClient
      .get(this.toDoUrl + "/todos", this.httpOptions)
      .pipe(retry(3), catchError(this.httpErrorHandler));
  }

  getSingleTodo(id: number) {
    return this.httpClient
      .get(this.toDoUrl + '/todo/' + id, this.httpOptions)
      .pipe(retry(3), catchError(this.httpErrorHandler));
  }

  deleteTodoEntry(id: number) {
    return this.httpClient
      .delete(this.toDoUrl + '/todo/' + id, this.httpOptions)
      .pipe(retry(3), catchError(this.httpErrorHandler));
  }

  addTodoEntry(toDoEntery: any): Observable<Todo> {
    return this.httpClient
      .post<Todo>(this.toDoUrl + '/todo', toDoEntery, this.httpOptions)
      .pipe(retry(3), catchError(this.httpErrorHandler));
  }

  updateTodoEntry(todo: Todo) {
    return this.httpClient
      .put<Todo>(this.toDoUrl + '/todo/' + todo.id, todo, this.httpOptions)
      .pipe(retry(3), catchError(this.httpErrorHandler));
  } 

  public converDateObjectToString(
    dateObject: any,
    targetDateFormat: any,
    delimeter: any
  ) {
    if (
      typeof dateObject == 'undefined' ||
      dateObject == null ||
      dateObject == ''
    )
      return '';
    else if (typeof dateObject == 'string') {
      dateObject = this.convertStringToDateObject(dateObject);
    }
    if (typeof dateObject == 'object') {
      if (targetDateFormat == 'DDMMYYYY') {
        return (
          (dateObject['day'].toString().length === 1
            ? '0' + dateObject['day']
            : dateObject['day']) +
          delimeter +
          (dateObject['month'].toString().length === 1
            ? '0' + dateObject['month']
            : dateObject['month']) +
          delimeter +
          dateObject['year']
        );
      } else if (targetDateFormat == 'MMDDYYYY') {
        return (
          (dateObject['month'].toString().length === 1
            ? '0' + dateObject['month']
            : dateObject['month']) +
          delimeter +
          (dateObject['day'].toString().length === 1
            ? '0' + dateObject['day']
            : dateObject['day']) +
          delimeter +
          dateObject['year']
        );
      } else if (targetDateFormat == 'YYYYMMDD') {
        return (
          dateObject['year'] +
          delimeter +
          (dateObject['month'].toString().length === 1
            ? '0' + dateObject['month']
            : dateObject['month']) +
          delimeter +
          (dateObject['day'].toString().length === 1
            ? '0' + dateObject['day']
            : dateObject['day'])
        );
      }
    }
  }

  convertStringToDateObject(
    date: string,
    format: string = 'DD-MM-YYYY',
    outputFormat: string = 'JSON'
  ) {
    if (typeof date == 'string') {
      if (date.indexOf(' ') > 0) {
        date = date.trim().split(' ')[0];
      }
      if (date.indexOf('T') > 0) {
        date = date.trim().split('T')[0];
      }
      if (outputFormat == 'JSON') {
        return JSON.parse(
          moment(date, format).format(
            '{["year"]: YYYY, ["month"]: M, ["day"]: D}'
          )
        );
      } else {
        return moment(date, format);
      }
    } else if (typeof date == 'object') {
      return date;
    } else {
      return '';
    }
  }

  private httpErrorHandler(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error(
        'A client side error occurs. The error message is ' + error.message
      );
    } else {
      console.error(
        'An error happened in server. The HTTP status code is ' +
          error.status +
          ' and the error returned is ' +
          error.message
      );
    }

    return throwError('Error occurred. Pleas try again');
  }
}
