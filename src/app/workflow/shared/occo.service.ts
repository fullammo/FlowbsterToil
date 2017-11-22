import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

/**
 * A service that holds the logic for communication with the Occopuses Rest interface.
 */
@Injectable()
export class OccoService {
  /**
   * The actual endpoint we want to reach with the http service.
   */
  url: string;
  infraid: string;

  /**
   * We inject Angular Http Service and set a default end point.
   * @param http Angular's new HttpClient
   */
  constructor(
    private http: HttpClient,
    private db: AngularFireDatabase,
    private auth: AngularFireAuth
  ) {
    this.url = 'http://192.168.248.129:5000'; // provide a URL that has an occopus running on it.
  }

  /**
   * It sets the headers to be applicable to a YAML formatted string.
   * Then it sends the yaml data via http and subscribes it, waiting for response from the server.
   * @param yamldescriptor
   */
  buildWorkflow(yamldescriptor: string, entryId: string) {
    console.log(entryId);
    const endpoint = this.url + '/infrastructures/';
    const header = new HttpHeaders();
    console.log(yamldescriptor);
    header.append('Content-Type', 'application/x-yaml');

    return this.http
      .post(endpoint, yamldescriptor, { headers: header })
      .subscribe(
        (res: { infraid: string }) => {
          console.log(res);

          this.infraid = res.infraid;
          console.log(this.infraid);

          this.auth.authState.take(1).subscribe(user => {
            if (!user) {
              return;
            }

            const data = { [user.uid]: { [entryId]: res } };
            this.db.object('infrastructures/').update(data);
          });
          return this;
        },
        error => {
          console.log('error occured', error);
        },
        () => {}
      );
  }

  /**
   * It sets the header to be applicable to a simple text message.
   * Then it sends the actual infrastructures ID back to the server with a destroy commands based URL,
   * and it subscribes to any response back from the server.
   */
  destroyWorkflow() {
    const infraid = 'asd';
    const endpoint = this.url + '/infrastructures/' + this.infraid;

    return this.http.delete(endpoint, { responseType: 'text' }).subscribe(
      res => {
        console.log(res);
        return this;
      },
      error => {
        console.log('error occured', error);
      },
      () => {}
    );
  }

  getWorkflowInformation(entryId?: string) {
    const endpoint = this.url + '/infrastructures/' + this.infraid;

    this.http.get(endpoint, { responseType: 'text' }).subscribe(
      res => {
        console.log(res);
      },
      error => {
        console.log('error occured', error);
      }
    );
  }
}
