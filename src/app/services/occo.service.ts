import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class OccoService {

  url: string;

  constructor(private http: HttpClient) {
    this.url = '127.0.0.1/5000/infrastructures'; // provide a URL that has an occopus running on it.
  }

  buildWorkflow(yamldescriptor: string) {
    const header = new HttpHeaders();
    header.append('Content-Type', 'application/x-yaml');

    return this.http.post(this.url, yamldescriptor, { headers: header }).subscribe(
      (res) => {
        console.log(res);
        return this;
      },
      (error) => {
        console.log('error occured', error);
      },
      () => {

      });
  }

  destroyWorkflow() {
    return this.http.post(this.url, { responseType: 'text' }).subscribe(
      (res) => {
        console.log(res);
        return this;
      },
      (error) => {
        console.log('error occured', error);
      },
      () => {

      });
  }
}
