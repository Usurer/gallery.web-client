import {
    ActivatedRoute,
    ActivatedRouteSnapshot,
    CanActivateFn,
    Route,
    Router,
    RouterModule,
    RouterStateSnapshot,
} from '@angular/router';
import { NgModule, inject } from '@angular/core';
import { ImagePopupComponent } from '../image-popup/image-popup.component';
import { MetadataService } from '../../services/metadata.service';
import { map } from 'rxjs';
import { FOLDER_ROUTE } from '../../app-routes';
import { FolderExplorerComponent } from './folder-explorer.component';

const CURRENT_ROOT = FOLDER_ROUTE;

const isRootIdSet: CanActivateFn = (routeSnapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const router = inject(Router);
    const activatedRoute = inject(ActivatedRoute);
    const rootId = Number.parseInt(routeSnapshot.paramMap.get('rootId') ?? '');
    const service = inject(MetadataService);
    return service.getImagesMetadata(isNaN(rootId) ? undefined : rootId).pipe(
        map((x) => {
            if (isNaN(rootId) && x) {
                router.navigate([CURRENT_ROOT, x.rootId], { relativeTo: activatedRoute });
            }
            return false;
        })
    );
};

const ROUTES: Route[] = [
    {
        path: `${CURRENT_ROOT}/:rootId`,
        component: FolderExplorerComponent,
        children: [{ path: ':id', component: ImagePopupComponent }],
    },
    {
        path: CURRENT_ROOT,
        component: FolderExplorerComponent,
        canActivate: [isRootIdSet],
    },
];

@NgModule({
    imports: [RouterModule.forChild(ROUTES)],
    exports: [RouterModule],
})
export class FolderExplorerRoutingModule {}
