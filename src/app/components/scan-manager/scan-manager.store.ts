import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { EMPTY, Observable, catchError, switchMap, tap } from 'rxjs';
import { SettingsService } from 'src/app/services/settings.service';

interface ScanManagerState {
    scans: string[];
}

@Injectable()
export class ScanManagerStore extends ComponentStore<ScanManagerState> {
    constructor(private httpClient: HttpClient, private settings: SettingsService) {
        super({ scans: [] });
    }

    readonly scans$ = this.select((x) => x.scans);

    readonly addScan = this.effect((path$: Observable<string>) => {
        return path$.pipe(
            tap((path) =>
                this.setState((currentState: ScanManagerState) => {
                    return {
                        ...currentState,
                        scans: [...currentState.scans, path],
                    };
                })
            ),
            switchMap((path) => {
                return this.httpClient.post(this.settings.environment.foldersApiUri, { path }).pipe(
                    catchError((error) => {
                        console.log(`Oops! An API access error! ${JSON.stringify(error)}`);

                        this.setState((currentState: ScanManagerState) => {
                            return {
                                ...currentState,
                                scans: currentState.scans.filter((x) => x !== path),
                            };
                        });

                        return EMPTY;
                    })
                );
            })
        );
    });
}
